import curry from 'lodash/curry';
import { getPageQuery } from './utils';
// const egUrl = 'http://192.168.14.140:7091/hy/saas/haoyun/erp/business/34562'
// const baseUrl = 'http://192.168.14.140:7091/hy/saas';
const baseUrl = '';
// const baseUrl = '/apbdsl';
export const originGenUrl = (lesseeCode, appCode, businessCode) => {
  return `${baseUrl}/${lesseeCode || "hy"}/${appCode || "zxx"}/business/${businessCode}`;
};

export const getAPBDSLtestUrl = (code = 'queryPerson') => {
  const { app, lessee } = getPageQuery();
  return originGenUrl(lessee, app, code);
};
