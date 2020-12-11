import { toBase64Str } from '@mini-code/request/url-resolve';
import { getAppConfig } from "./config-manager";

interface Options {
  appName: string
  mode: 'perv' | 'pro'
  defaultPath: string
  pageID: string
  lessee: string
  app: string
}

const toQueryString = (params) => {
  let res = '';
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const val = params[key];
      if (val) {
        // 这里将传入应用端的参数都转 base64，避免中文编码的问题
        res += `&${key}=${toBase64Str(val)}`;
      }
    }
  }
  return res;
};

/**
 * 获取预览地址
 */
export const getAppPreviewUrl = (options?: Options) => {
  const {
    appName = '测试应用',
    mode = '',
    defaultPath = '',
    pageID,
    app,
  } = options || {};
  const saasServerUrl = getAppConfig(`saasServerUrlForPreviewApp`);
  const pageServerUrlForApp = getAppConfig(`FEResourceServerUrl`);
  const appEntryUrl = getAppConfig(`previewAppEntryUrl`);

  const queryParamUrl = toQueryString({
    mode,
    appName,
    pageID: pageID,
    lessee: $R_P.urlManager.currLessee,
    app,
    t: $R_P.config.commonHeaders?.Authorization,
    saasServerUrl,
    pageServerUrlForApp,
    menuid: defaultPath ? `/${defaultPath}` : ''
  });
  // console.log(`${appEntryUrl}/#/${defaultPath ? 'page' : ''}?${queryParamUrl}`);
  return `${appEntryUrl}/#/${defaultPath ? 'page' : ''}?${queryParamUrl}`;
};
