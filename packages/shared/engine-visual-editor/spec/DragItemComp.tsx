/* eslint-disable no-lonely-if */
import React, { useState, useRef } from "react";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import clas from "classnames";
import { TargetType } from "dnd-core";
import { ElemNestingInfo, getItemParentIdx } from "@engine/layout-renderer";
import { DnDContext, DragableItemTypes, DragItemActions } from ".";
import {
  DragableItemType,
  DragableWidgetBaseType,
  DropCollectType,
} from "../data-structure";
import { isNodeInChild } from "../utils";

type DefaultDragableWidgetType = Record<string, unknown>;

/**
 * 作用于 dragItem 传递到 drop 容器的参数配置
 */
interface DraggedItemInfo<D = DefaultDragableWidgetType> {
  nestingInfo?: ElemNestingInfo;
  parentIdx?: ElemNestingInfo;
  type: string | symbol;
  dragableWidgetType: DragableWidgetBaseType & D;
}

type OmitHtmlAttr = "children" | "id";
type HtmlAttr = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof DragItemActions | keyof DraggedItemInfo | OmitHtmlAttr
>;

export interface DragItemCompProps<D = DefaultDragableWidgetType, C = any>
  extends DraggedItemInfo<D>,
    DragItemActions,
    HtmlAttr {
  id: string;
  /** 用于排序时判断排序位置的 pixel */
  sortAreaPixel?: number;
  children: React.ReactChild;
  accept?: TargetType;
  /** 是否为容器 */
  isContainer?: boolean;
  /** 拖动排序的方向，x 轴 ｜ y 轴 */
  sortDirection?: "x" | "y";
  nestingInfo?: ElemNestingInfo;
  /** 是否可排序 */
  sortable?: boolean;
}

/**
 * 拖拽容器
 */
export const DragItemComp: React.FC<DragItemCompProps> = ({
  children,
  dragableWidgetType,
  style,
  type,
  className,
  sortable,
  sortDirection = "y",
  nestingInfo,
  isContainer,
  sortAreaPixel = 20,
  accept = [
    DragableItemTypes.DragItemEntity,
    DragableItemTypes.DragableItemType,
  ],
  onItemHover,
  onItemMove,
  onItemDrop,
  onItemDrag,
  ...other
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOverCurrent, canDrop }, drop] = useDrop<
    DragableItemType,
    void,
    DropCollectType
  >({
    accept,
    drop: (item) => {
      /**
       * 使用文档参考: https://react-dnd.github.io/react-dnd/docs/api/use-drop
       */
      const {
        dragableWidgetType: dragedItemType,
        nestingInfo: dragItemNestInfo,
      } = item;
      /**
       * isOverCurrent 判断是否拖动在容器内
       */
      if (isOverCurrent) {
        setTimeout(() => {
          if (onItemDrop && nestingInfo) {
            const dropTargetCtx: DnDContext = {
              dropItemNestInfo: [...nestingInfo],
              dragItemNestInfo: [...(dragItemNestInfo || [])],
            };
            onItemDrop({ ...dragedItemType }, dropTargetCtx);
          }
        });
      }
    },
    // canDrop: ({ dragableWidgetType: widgetType }, monitor) => {
    //   /** 不允许放到自身 */
    //   return widgetType.id !== id;
    // },
    collect: (monitor) => {
      return {
        // isOver: !!monitor.isOver(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      };
    },
    hover: (item, monitor) => {
      if (!ref.current || !onItemMove || !nestingInfo?.join()) {
        return;
      }

      const dragItemNestInfo = item.nestingInfo || [];
      const hoverIndex = [...nestingInfo];

      onItemHover?.(hoverIndex, {
        isContainer,
      });

      item.parentIdx = getItemParentIdx(dragItemNestInfo);

      // Don't replace items with themselves
      if (dragItemNestInfo.join() === hoverIndex.join()) {
        return;
      }

      const dragIndex = [...dragItemNestInfo];

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Get horizontal middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      /** 是否拖动的元素的 index 小于被 hover 的元素 */
      const isDragIdxLessThenHoveringItem =
        +dragIndex.join("") < +hoverIndex.join("");

      /** 是否拖动的元素的 index 大于被 hover 的元素 */
      const isDragIdxGreeterThenHoveringItem = !isDragIdxLessThenHoveringItem;

      if (sortDirection === "x") {
        if (
          // Dragging to left
          (isDragIdxLessThenHoveringItem &&
            hoverClientX < hoverMiddleX + sortAreaPixel) ||
          // Dragging to right
          (isDragIdxGreeterThenHoveringItem &&
            hoverClientX > hoverMiddleX - sortAreaPixel)
        ) {
          return;
        }

        // if (
        //   isDragIdxGreeterThenHoveringItem &&
        //   hoverClientX > hoverMiddleX - sortAreaPixel
        // ) {
        //   return;
        // }
      } else {
        // Dragging downwards
        const fromTop = hoverClientY < hoverMiddleY + sortAreaPixel;
        const fromBottom = hoverClientY > hoverMiddleY - sortAreaPixel;
        if (
          (isDragIdxLessThenHoveringItem && fromTop) ||
          (isDragIdxGreeterThenHoveringItem && fromBottom)
        ) {
          /** 进入了不排序的区域 */
          // TODO: 移出容器的事件
          if (isContainer) {
            /** 如果父级是容器，将当前 item 的 parentIdx 指向父级的 idx */
            if (item.parentIdx?.join("") === hoverIndex.join("")) return;
            item.parentIdx = hoverIndex;
            onItemMove?.(dragIndex, hoverIndex, {
              isContainer,
              from: fromTop ? "top" : "button",
            });
          }
          return;
        }

        // Dragging upwards
        // if (
        //   isDragIdxGreeterThenHoveringItem &&
        //   hoverClientY > hoverMiddleY - sortAreaPixel
        // ) {
        //   return;
        // }

        // Time to actually perform the action
        // onItemMove?.(dragIndex, hoverIndex, item);
      }

      item.parentIdx = null;
      // Time to actually perform the action
      onItemMove?.(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.nestingInfo = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: {
      dragableWidgetType,
      type,
      isContainer,
      nestingInfo,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    begin: (item) => {
      const dragCtx = {
        dragableWidgetType,
        type,
        isContainer,
        nestingInfo,
      };
      onItemDrag?.(dragCtx);
    },
  });

  const classes = clas(className, [
    isContainer && isOverCurrent ? "overing" : "",
    isDragging && "isDragging",
  ]);

  if (sortable) {
    /** 如果需要排序功能，则需要 drop 包装 */
    drag(drop(ref));
  } else {
    drag(ref);
  }

  return (
    <div {...other} className={classes} ref={ref}>
      {children}
    </div>
  );
};

export default DragItemComp;
