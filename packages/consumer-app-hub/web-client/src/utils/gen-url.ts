import store from 'store';
import { getPageQuery } from './utils';

export const SYS_MENU_BUSINESSCODE = '__system_get_app_menu__';

export const originGenUrl = (lesseeCode, appCode, businessCode) => {
  const baseUrl = store.get('saasServerUrl');
  const isHttp = /http/.test(baseUrl);
  return `${(!isHttp ? 'http://' : '') + baseUrl}/hy/saas/${lesseeCode}/${appCode}/business/${businessCode}`;
};

export const getAPBDSLtestUrl = (code = SYS_MENU_BUSINESSCODE) => {
  let { lessee, app } = getPageQuery();
  if (!lessee) lessee = store.get("app/lessee");
  if (!app) app = store.get("app/code");
  return originGenUrl(lessee, app, code);
};
