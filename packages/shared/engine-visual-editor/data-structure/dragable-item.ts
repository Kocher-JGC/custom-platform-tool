/// //////////////// 拖拽 ///////////////////

import { ElemNestingInfo } from "@engine/layout-renderer";
import { EditableWidgetMeta } from "./widget";

/**
 * 基本拖拽项
 */
export interface BasicDragableItemType {
  /** 用于临时记录拖拽时的位置，被拖拽时动态赋值的 */
  nestingInfo?: ElemNestingInfo
  parentIdx?: ElemNestingInfo | null
  /** 可拖拽的项的类型 */
  type: string
  /** 拖拽带的 item 参数 */
  dragableWidgetType: any
  /** 自定义的拖拽的配置 */
  dragConfig?: any
}

/**
 * 组件类拖拽项
 */
export interface DragableItemType extends BasicDragableItemType {
  dragableWidgetType: EditableWidgetMeta
}

/**
 * 接受拖 item 的 prop
 */
export interface DropCollectType {
  isOver: boolean
  isOverCurrent: boolean
  canDrop: boolean
}

export interface AcceptChildSetting {
  /** 接受的类型的策略，白名单还是黑名单 */
  strategy: 'blackList' | 'whiteList'
  /** 拒绝接受的子组件的黑明白 */
  blackList?: string[]
  /** 接受的子组件的白名单 */
  whiteList?: string[]
}


export interface DragableWidgetBaseType {
  /** 接受子内容的策略，布局组件的基础 */
  acceptChildStrategy?: AcceptChildSetting
}