import { ChangeMetadataOptions } from "@engine/visual-editor/core/actions/change-meta";
import { ChangeEntityState, GenMetaRefID, TakeMeta } from "@engine/visual-editor/data-structure";

export interface OnDatasourceSelectorSubmitOptions {
  /** 关闭当前弹窗 */
  close: () => void
  /** 内部的数据源结构 */
  interDatasources
  /** 从远端选择回来的数据源 */
  selectedDSFromRemote
}

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
  onSubmit: (submitOptions: OnDatasourceSelectorSubmitOptions) => void
  /** 是否单选 */
  single?: boolean
}

export type OpenDatasourceSelector = (options: OpenDatasourceSelectorOptions) => () => void

export type ChangeWidgetType = (widgetType: string) => void

/**
 * 平台提供的 UI 上下文，提供以下能力
 * 1. 使用平台的 UI
 * 2. 更改页面的元数据
 * 3. 更改组件实例的默认属性
 */
export interface PlatformCtx {
  /** 可以使用平台提供的 UI 展示能力 */
  ui: {
    showMsg: (ctx: { msg: string, type: 'success' | 'error' }) => void
  }
  /** 由页面设计器提供的选择器 */
  selector: {
    openDatasourceSelector: OpenDatasourceSelector
  }
  /** 对于页面元数据的操作 */
  meta: {
    /** 更改页面的 meta 数据，如果没有该数据，则返回新创建的 metaID */
    changePageMeta: (options: ChangeMetadataOptions) => string | string[]
    /** 获取 meta */
    takeMeta: TakeMeta
    /** 生成 meta 引用的 ID */
    genMetaRefID: GenMetaRefID
    /** 更改组件的类型 */
    changeWidgetType: ChangeWidgetType
    /** 更改 widget state */
    changeEntityState: ChangeEntityState
  }
}
