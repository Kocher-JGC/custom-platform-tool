import { WidgetEntityState } from "@engine/visual-editor/data-structure";

export interface WidgetEditablePropMeta {
  /** 属性的类型 */
  type: 'string' | 'number' | 'boolean' | 'any' | 'struct'
  /** 属性的别名 */
  alias?: string
}

export interface WidgetEditableProps {
  [propName: string]: WidgetEditablePropMeta
}

/**
 * 基础的 UI 接入规范
 */
export interface BusinessWidgetMeta {
  /** 组件的名称 */
  name: string
  /** 可编辑的属性, TODO: 需要一套校验可编辑属性的规则的工具 */
  editableProps: WidgetEditableProps
  /** 挂载时的回调 */
  didMount?: () => void
  /** 被卸载时的回调 */
  didUnmount?: () => void
  /** 用于渲染的组件 */
  render: (widgetState: WidgetEntityState) => JSX.Element
}

/**
 * 不符合预期的组件
 */
export interface UnexpectedWidgetMeta {
  /** 未符合预期 */
  unexpected: true
}

/**
 * 业务组件的接入标准
 */
export type BusinessWidgetAccessSpec = () => BusinessWidgetMeta
