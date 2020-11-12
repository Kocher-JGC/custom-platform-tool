export enum UsedConfKey {
  passServerUrl = 'passServerUrl',
  sassServerUrl = 'sassServerUrl',
  pageServerUrl = 'pageServerUrl',
  appUrl = 'appUrl',
}
/** confJson的key */
export enum ConfKey {
  /** pass平台的URL */
  passServerUrl = 'passServerUrl',
  /** 预览时候sass服务的url */
  previewSassServerUrl = 'previewSassServerUrl',
  /** 预览时候页面服务的url */
  previewPageServerUrl = 'previewPageServerUrl',
  /** 预览时候应用的url */
  previewAppUrl = 'previewAppUrl',
  /** 发布时候sass的url */
  publishSassServerUrl = 'publishSassServerUrl', //
  /** 发布时候页面服务的url */
  publishPageServerUrl = 'publishPageServerUrl', //
  /** 发布时候应用的url */
  publishAppUrl = 'publishAppUrl', //
}

export const usedConfKey = Object.keys(UsedConfKey);
