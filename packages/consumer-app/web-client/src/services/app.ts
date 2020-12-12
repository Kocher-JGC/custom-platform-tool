import store from 'store';
import { UrlConfKey } from '../utils/env';

/**
 * 获取当前安装应用
 */
export async function queryInstallApp() {
  const pageServerUrl = store.get(UrlConfKey.pageServerUrlForApp);
  const isHttp = /http/.test(pageServerUrl);

  return $A_R(`${`${(!isHttp ? 'http://' : '') + pageServerUrl}`}/app-list?t=${new Date().getTime()}`);
}