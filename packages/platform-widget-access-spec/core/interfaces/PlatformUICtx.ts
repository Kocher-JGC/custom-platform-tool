export interface OpenDatasourceSelectorOptions {
  /** 选择数据源的类型 */
  type: 'TABLE' | 'DICT'
  /** 默认选择的数据源的项 */
  defaultSelected
  /** 数据源选择器选择后的回调 */
  onSubmit: () => void
}

export type OpenDatasourceSelector = (options: OpenDatasourceSelectorOptions) => void

/**
 * 平台提供的 UI 上下文
 */
export interface PlatformUICtx {
  utils: {
    showMsg: (ctx: { msg: string, type: 'success' | 'error' }) => void
  }
  openDatasourceSelector: OpenDatasourceSelector
}