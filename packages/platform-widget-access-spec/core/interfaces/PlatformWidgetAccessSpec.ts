import { WidgetEditableProps, WidgetEntityState } from "@engine/visual-editor/data-structure";

/**
 * 来自应用运行时传入的上下文
 * TODO: 蒋国才 ，完善应用传入的内容
 */
export interface WidgetActions {
  onClick: () => void
  onChange: () => void
}

export type PlatformWidgetRender = (
  widgetState: WidgetEntityState, 
  widgetActions: WidgetActions
) => JSX.Element

/**
 * 平台组件 meta
 */
export interface PlatformWidgetMeta {
  /** 组件的名称 */
  name: string
  /** 
   * 可编辑的属性，用于告诉平台，该组件有多少属性可以被编辑
   * 1. 暂时未开放
   * 2. TODO: 需要一套校验可编辑属性的规则的工具 
   */
  editableProps: WidgetEditableProps
}

/**
 * 平台组件定义
 */
export interface PlatformWidgetComp {
  /** 挂载时的回调 */
  didMount?: () => void
  /** 被卸载时的回调 */
  didUnmount?: () => void
  /** 用于渲染的组件 */
  render: PlatformWidgetRender
}

/**
 * 不符合预期的组件
 */
export interface UnexpectedWidgetMeta {
  /** 未符合预期 */
  unexpected: true
}

export interface CustomEditorMeta {
  name: string
}
