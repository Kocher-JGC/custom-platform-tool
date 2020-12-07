import React, { useState, useRef } from 'react';
import {
  useDrag, useDrop, DropTargetMonitor, XYCoord
} from 'react-dnd';
import { TargetType } from 'dnd-core';
import { HasValue } from '@mini-code/base-func';
import { DragableItemTypes, DragItemActions } from '.';
import { DragableItemType, DragableWidgetBaseType, DropCollectType } from '../data-structure';
import { isNodeInChild } from '../utils';

/**
 * 作用于 dragItem 传递到 drop 容器的参数配置
 */
interface DraggedItemInfo<D = Record<string, unknown>> {
  index?: number
  type: string | symbol
  dragableWidgetType: DragableWidgetBaseType & D
  dragConfig?: C
}

type OmitHtmlAttr = 'children' | 'id'
type HtmlAttr = Omit<React.HTMLAttributes<HTMLDivElement>, keyof DragItemActions | keyof DraggedItemInfo | OmitHtmlAttr>

export interface DragItemCompProps<
  D, C = any
> extends DraggedItemInfo<D>, DragItemActions, HtmlAttr {
  id: string
  children: any
  accept?: TargetType
}

/**
 * 拖拽容器
 */
export const DragItemComp: React.FC<DragItemCompProps> = ({
  children, dragableWidgetType, dragConfig, style,
  type, index,
  accept = [DragableItemTypes.DragItemEntity, DragableItemTypes.DragableItemType],
  onItemMove, onItemDrop, onItemDrag,
  ...other
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{
    isOverCurrent,
    canDrop
  }, drop] = useDrop<DragableItemType, void, DropCollectType>({
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
            const dropCtx = { idx: index, dropTargetItem };
            onItemDrop({ ...dragedItemType }, dropCtx);
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
      if (!ref.current || !onItemMove || !HasValue(index)) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      const { embedable } = item.dragableWidgetType;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onItemMove?.(dragIndex, hoverIndex, item);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: {
      dragConfig,
      dragableWidgetType,
      type,
      index,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  // drag(ref);
  drag(drop(ref));

  return (
    <div
      {...other}
      style={Object.assign({}, style, {
        opacity
      })}
      ref={ref}
    >
      {children}
    </div>
  );
};

export default DragItemComp;
