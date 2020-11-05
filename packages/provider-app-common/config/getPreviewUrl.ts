import { urlParamsToQuery } from '@mini-code/request';
import { getAppConfig } from "./config-manager";

interface Options {
  appName: string
  mode: string
  defaultPath: string
  pageID: string
  lessee: string
  app: string
}

/**
 * 获取预览地址
 */
export const getAppPreviewUrl = (options?: Options) => {
  const {
    appName = '测试应用',
    mode = '',
    defaultPath = '',
    pageID,
    app
  } = options || {};
  const perviewAppUrl = getAppConfig('perviewAppUrl');
  return `${perviewAppUrl}/#/page?${defaultPath ? `menuid=/${defaultPath}` : ''}&mode=${mode}&${pageID ? `pageId=${pageID}` : ''}&lessee=${$R_P.urlManager.currLessee}&app=${app}&appName=${appName}&t=${$R_P.config.commonHeaders?.Authorization}`;
};
