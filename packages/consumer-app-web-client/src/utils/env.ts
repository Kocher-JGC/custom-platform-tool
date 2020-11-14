/** confJson的key */
export enum ConfKey {
  /** 预览时候sass服务的url */
  saasServerUrl = 'saasServerUrl',
  /** 预览时候页面服务的url */
  previewPageServerUrl = 'previewPageServerUrl',
}

export const usedConfKey = Object.keys(ConfKey);
