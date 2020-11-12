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
        res += `&${key}=${val}`;
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
  const sassServerUrl = getAppConfig(`${mode === 'pro' ? 'prod' : 'preview'}SassServerUrl`);
  const pagePushServerUrl = getAppConfig(`${mode === 'pro' ? 'prod' : 'preview'}PagePushServerUrl`);
  const appUrl = getAppConfig(`${mode === 'pro' ? 'prod' : 'preview'}AppUrl`);
  const queryUrl = toQueryString({
    mode,
    appName,
    pageId: pageID,
    lessee: $R_P.urlManager.currLessee,
    app,
    t: $R_P.config.commonHeaders?.Authorization,
    sassServerUrl,
    pagePushServerUrl,
    menuid: defaultPath ? `menuid=/${defaultPath}` : ''
  });
  console.log(`${appUrl}/#/${defaultPath ? 'page' : ''}?${queryUrl}`);
  return `${appUrl}/#/${defaultPath ? 'page' : ''}?${queryUrl}`;
  // return `${appUrl}/#/${defaultPath ? 'page' : ''}?${defaultPath ? `menuid=/${defaultPath}` : ''}&mode=${mode}&${pageID ? `pageId=${pageID}` : ''}&lessee=${$R_P.urlManager.currLessee}&app=${app}&appName=${appName}&t=${$R_P.config.commonHeaders?.Authorization}${appApiUrl ? `&API=${appApiUrl}` : ''}`;
};
