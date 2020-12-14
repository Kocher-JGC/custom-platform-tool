/**
 * DropStageContainer
 */
import React from "react";
import { useDrop } from "react-dnd";
import classnames from "classnames";
import {
  DragableItemType,
  DropCollectType,
} from "@engine/visual-editor/data-structure";
import { Call } from "@mini-code/base-func";

/**
 * 中央舞台组件的 props
 */
export interface DropStageProps {
  onItemDrop;
  onLeave?: (dragItem: DragableItemType) => void;
  onEnter?: (dragItem: DragableItemType) => void;
  /** 触发 onEnter 和 onLeave 的条件 */
  triggerCondition?: (dragItem: DragableItemType) => boolean;
  onStageClick?: () => void;
  style;
  className?;
  accept: string[];
  children;
}

/**
 * @important
 * @author zxj
 * 记录是否进入过画布区域
 *
 * 策略
 *
 * 1. 拖动进入画布区域时设置为 true
 * 2. 在画布中释放后设置为 false
 * 3. 在拖动状态时，移出画布时设置为 false
 */
let __isEntered = false;

/**
 * 中央舞台组件
 */
const DropStageContainer: React.FC<DropStageProps> = ({
  onLeave,
  onEnter,
  triggerCondition,
  onStageClick,
  onItemDrop,
  style,
  className,
  accept,
  children,
}) => {
  /** 元素进出画布区域触发器 */
  const stageAreaEnterLeaveTrigger = (isOver, canDrop, dragItem) => {
    const _isOver = isOver;
    if (canDrop) {
      if (_isOver) {
        if (!__isEntered) {
          Call(onEnter, dragItem);
          // 1. 拖动进入画布区域时设置为 true
          __isEntered = true;
        }
      } else if (__isEntered) {
        Call(onLeave, dragItem);
        // 3. 在拖动状态时，移出画布时设置为 false
        __isEntered = false;
      }
    }
  };
  const [{ isOver, isOverCurrent, canDrop }, drop] = useDrop<
    DragableItemType,
    void,
    DropCollectType
  >({
    accept,
    drop: (dropOptions) => {
      const { dragableWidgetType, type } = dropOptions;
      if (isOverCurrent) {
        const _dragableItemDef = { ...dragableWidgetType };
        onItemDrop(_dragableItemDef, dropOptions);

        // 2. 在画布中释放后设置为 false
        __isEntered = false;
      }
    },
    // hover: (item) => {
    // },
    collect: (monitor) => {
      const _isOver = monitor.isOver({ shallow: false });
      const _canDrop = monitor.canDrop();
      const dragItem = monitor.getItem();

      if (triggerCondition && triggerCondition(dragItem)) {
        /** 针对组件类的判断 */
        stageAreaEnterLeaveTrigger(_isOver, _canDrop, dragItem);
      }

      return {
        // isOver: !!monitor.isOver(),
        dragItem,
        isOver: _isOver,
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: _canDrop,
      };
    },
  });

  const stageClasses = classnames([
    className,
    "canvas-stage",
    "renderer",
    isOver && "overing",
  ]);

  return (
    <div
      ref={drop}
      onClick={(e) => {
        onStageClick?.();
      }}
      className={stageClasses}
      style={style}
    >
      {children}
    </div>
  );
};

export default DropStageContainer;
