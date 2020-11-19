import { ChangePageMeta } from "@engine/visual-editor/core";
import { GenMetaRefID, TakeMeta } from "@engine/visual-editor/data-structure";

export interface OnDatasourceSelectorSubmitOptions {
  /** 关闭当前弹窗 */
  close: () => void
  /** 内部的数据源结构 */
  interDatasources
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
  onSubmit: (submitData, submitOptions: OnDatasourceSelectorSubmitOptions) => void
  /** 是否单选 */
  single?: boolean
}

export type OpenDatasourceSelector = (options: OpenDatasourceSelectorOptions) => () => void

/**
 * 平台提供的 UI 上下文
 */
export interface PlatformCtx {
  ui: {
    showMsg: (ctx: { msg: string, type: 'success' | 'error' }) => void
  }
  selector: {
    openDatasourceSelector: OpenDatasourceSelector
  }
  meta: {
    /** 更改页面的 meta 数据 */
    changePageMeta: typeof ChangePageMeta
    /** 获取 meta */
    takeMeta: TakeMeta
    /** 生成 meta 引用的 ID */
    genMetaRefID: GenMetaRefID
  }
}