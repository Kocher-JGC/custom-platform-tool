import curry from 'lodash/curry';
import store from 'store';
import { getPageQuery } from './utils';

// const egUrl = 'http://192.168.14.140:7091/hy/saas/haoyun/erp/business/34562'
// const baseUrl = 'http://192.168.14.140:7091/hy/saas';
const baseUrl = '';
// const baseUrl = '/apbdsl';

export const SYS_MENU_BUSINESSCODE = '__system_get_app_menu__';

export const originGenUrl = (lesseeCode, appCode, businessCode) => {
  return `${baseUrl}/${lesseeCode || "hy"}/${appCode || "zxx"}/business/${businessCode}`;
};

export const getAPBDSLtestUrl = (code = SYS_MENU_BUSINESSCODE) => {
  let { lessee, app } = getPageQuery();
  if (!lessee) lessee = store.get("lesseeCode");
  if (!app) app = store.get("applicationCode");
  return originGenUrl(lessee, app, code);
};
