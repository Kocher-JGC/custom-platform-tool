/* eslint-disable no-lonely-if */
import React, { useState, useRef } from "react";
import { useDrag, useDrop, DropTargetMonitor, XYCoord } from "react-dnd";
import clas from "classnames";
import { TargetType } from "dnd-core";
import { HasValue } from "@mini-code/base-func";
import { ElemNestingInfo } from "@engine/layout-renderer";
import { DragableItemTypes, DragItemActions } from ".";
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
  type: string | symbol;
  dragableWidgetType: DragableWidgetBaseType & D;
  dragConfig?: C;
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
  children: any;
  accept?: TargetType;
  /** 是否为容器 */
  isContainer?: boolean;
  /** 拖动排序的方向，x 轴 ｜ y 轴 */
  sortDirection?: "x" | "y";
  nestingInfo?: ElemNestingInfo;
}

/**
 * 拖拽容器
 */
export const DragItemComp: React.FC<DragItemCompProps> = ({
  children,
  dragableWidgetType,
  dragConfig,
  style,
  type,
  className,
  sortDirection = "y",
  nestingInfo,
  isContainer,
  sortAreaPixel = 20,
  accept = [
    DragableItemTypes.DragItemEntity,
    DragableItemTypes.DragableItemType,
  ],
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
    /**
     * ref: https://react-dnd.github.io/react-dnd/docs/api/use-drop
     */
    drop: ({ dragableWidgetType: dragedItemType }) => {
      /**
       * @important 重要策略
       *
       * 1. isOverCurrent 判断是否拖动在容器内
       * 2. isNodeInChild 判断自身是否拖到子容器中，避免嵌套
       */
      if (isOverCurrent) {
        setTimeout(() => {
          const dropTargetItem = dragableWidgetType;
          if (onItemDrop) {
            const _nestingInfo = [...nestingInfo];
            const dropTargetCtx = { nestingInfo: _nestingInfo, dropTargetItem };
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
    hover: (item: DraggedItemInfo, monitor: DropTargetMonitor) => {
      if (!ref.current || !onItemMove || !nestingInfo?.join()) {
        return;
      }
      const dragItemNestInfo = item.nestingInfo || [];
      const hoverIndex = [...nestingInfo];

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
          if (isContainer) {
            console.log("asd");
          }
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
        if (
          (isDragIdxLessThenHoveringItem &&
            hoverClientY < hoverMiddleY + sortAreaPixel) ||
          (isDragIdxGreeterThenHoveringItem &&
            hoverClientY > hoverMiddleY - sortAreaPixel)
        ) {
          if (isContainer) {
            item.nestingInfo = [...hoverIndex, 0];
            console.log(item.nestingInfo, hoverIndex, item);
            // onItemMove?.([...hoverIndex, 0], hoverIndex, item);
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

      // Time to actually perform the action
      onItemMove?.(dragIndex, hoverIndex, item);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.nestingInfo = hoverIndex;
      console.log(hoverIndex);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: {
      dragConfig,
      dragableWidgetType,
      type,
      isContainer,
      nestingInfo,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const classes = clas(className, [
    isContainer && isOverCurrent ? "overing" : "",
    isDragging && "isDragging",
  ]);

  // drag(ref);
  drag(drop(ref));

  return (
    <div {...other} className={classes} ref={ref}>
      {children}
    </div>
  );
};

export default DragItemComp;
