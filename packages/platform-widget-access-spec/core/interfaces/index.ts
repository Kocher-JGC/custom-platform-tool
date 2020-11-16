export * from './PlatformWidgetAccessSpec';
// export * from './PropItemCompAccessSpec';

export interface UICtx {
  utils: {
    showMsg: (ctx: { msg: string, type: 'success' | 'error' }) => void
  }
}