import { ChangeMetadata } from "@engine/visual-editor/core";
import { ChangeEntityState, GenMetaRefID, TakeMeta, WidgetEntity } from "@engine/visual-editor/data-structure";

export interface OpenDatasourceSelectorOptions {
  /** 弹出的类型 */
  modalType: 'normal' | 'side'
  /** 弹出的位置 */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** 选择数据源的类型 */
  type: 'TABLE' | 'DICT'
  /** 默认选择的数据源的项 */
  defaultSelected: ({ id: string })[]
  /** 数据源选择器选择后的回调 */
  onSubmit: (submitData, { close }) => void
}

export type OpenDatasourceSelector = (options: OpenDatasourceSelectorOptions) => () => void

/**
 * 平台提供的 UI 上下文
 */
export interface PlatformUICtx {
  utils: {
    showMsg: (ctx: { msg: string, type: 'success' | 'error' }) => void
  }
  openDatasourceSelector: OpenDatasourceSelector
}

export interface PropItemRenderContext {
  /** 业务数据 */
  businessPayload: PD.PropItemRendererBusinessPayload
  /** 编辑中的组件实例 */
  readonly widgetEntity: WidgetEntity
  /** 组件实例状态 */
  readonly editingWidgetState: any
  /** 更改组件实例状态的接口 */
  changeEntityState: ChangeEntityState
  /** 更改页面的 meta 数据 */
  changeMetadata: typeof ChangeMetadata
  /** 获取 meta */
  takeMeta: TakeMeta
  /** 生成 meta 引用的 ID */
  genMetaRefID: GenMetaRefID
}