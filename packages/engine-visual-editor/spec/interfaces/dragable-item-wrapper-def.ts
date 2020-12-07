/**
 * 可拖拽项包装器的定义
 */
import {
  ElemNestingInfo,
  LayoutWrapperContext
} from '@engine/layout-renderer';
import { VEDispatcher } from '../../core/actions';
import { WidgetEntity, WidgetEntityState } from '../../data-structure';

/**
 * DnD 的回调的 context
 */
export interface DnDContext {
  idx: number
  dropTargetItem: WidgetEntity
}

export type DragItemConfig = any;

export type OnItemDrop = (dragItem, dndContext: DnDContext) => void
export type OnItemDrag = (dragItem, dndContext: DnDContext) => void
export type DragItemMove = (dragIndex: number, hoverIndex: number, compClass: any) => void
export type CancelDrag = (originalIndex: number) => void

export interface GetStateContext {
  nestingInfo: ElemNestingInfo
  idx: number
  id: string
}

/**
 * 包装器的元素的事件回调上下文
 */
interface ActionCtx {
  entity: WidgetEntity
  idx: number
  nestingInfo: ElemNestingInfo
}

export type GetEntityProps = (ctx: GetStateContext) => WidgetEntityState | undefined
export type GetSelectedState = (ctx: GetStateContext) => boolean
export type GetLayoutNode = (ctx: GetStateContext) => WidgetEntity
export type WrapperItemClickEvent = (event, actionCtx: ActionCtx) => void
export type WrapperItemDeleteEvent = (event, actionCtx: ActionCtx) => void

/**
 * 可拖拽元素的 actions
 */
export interface DragItemActions {
  /** 响应组件的“放”事件 */
  onItemDrop?: OnItemDrop
  /** 响应组件的“拖”事件 */
  onItemDrag?: OnItemDrag
  /** 响应组件的“被拖动”的事件 */
  onItemMove?: DragItemMove
}

export interface WrapperFacContext {
  /** 获取选中的组件实例的状态 */
  getSelectedState: GetSelectedState
  /** 获取组件实例的 props */
  getEntityProps: GetEntityProps
  /** 扁平的 node 结构 */
  getLayoutNode: GetLayoutNode
  updateEntityState: VEDispatcher['UpdateEntityState']
}

/**
 * 包装器的元素的 action
 */
export interface WrapperFacActions extends DragItemActions {
  /** 响应组件点击事件 */
  onDelete: WrapperItemDeleteEvent
  /** 响应组件点击事件 */
  onItemClick: WrapperItemClickEvent
}

/**
 * 包装器的 options
 */
export type WrapperFacOptions = WrapperFacContext & WrapperFacActions

/**
 * 可拖拽包装器的定义
 */
export type DragableItemWrapperFac = (
  wrapperFacOptions: WrapperFacOptions
) => (
  props: LayoutWrapperContext
) => JSX.Element
