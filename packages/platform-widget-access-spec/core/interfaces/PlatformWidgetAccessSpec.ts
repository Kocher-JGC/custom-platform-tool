import { WidgetEditableProps, WidgetEntityState } from "@engine/visual-editor/data-structure";

export type BusinessWidgetRender = (widgetState: WidgetEntityState) => JSX.Element

/**
 * 平台组件 meta
 */
export interface PlatformWidgetMeta {
  /** 组件的名称 */
  name: string
  /** 可编辑的属性, TODO: 需要一套校验可编辑属性的规则的工具 */
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
  render: BusinessWidgetRender
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
export class PlatformWidgetAccessSpec implements PlatformWidgetMeta {
  name!: PlatformWidgetMeta['name']

  editableProps!: PlatformWidgetMeta['editableProps']

  render!: PlatformWidgetMeta['render']
}
// export type PlatformWidgetAccessSpec = () => PlatformWidgetMeta
