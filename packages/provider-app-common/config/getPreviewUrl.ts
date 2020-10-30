import { getAppConfig } from "./config-manager";

/**
 * 获取预览地址
 * @param appLocation
 * @param appName
 */
export const getPreviewUrl = (appLocation?, appName = '测试应用') => {
  const perviewAppUrl = getAppConfig('perviewAppUrl');
  if (!appLocation) return `${perviewAppUrl}`;
  const { pageID, lessee = 'hy', app } = appLocation;
  return `${perviewAppUrl}/#/page?menuid=/preview&mode=preview&pageId=${pageID}&lessee=${lessee}&app=${app}&appName=${appName}&t=${$R_P.config.commonHeaders?.Authorization}`;
};
