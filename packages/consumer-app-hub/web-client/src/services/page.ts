import store from 'store';
import { UrlConfKey } from '../utils/env';

/**
 * 获取页面数据
 * @param params
 */

const filterRes = (res) => {
  if (res.data.code === "00000") {
    return res.data?.result;
  } if (res.status === 200) {
    return res.data;
  }
  return {};
};

const mergeParam = (params: API.IPageDataParams): API.IPageDataParams => {
  params.lessee = params.lessee || store.get('app/lessee');
  params.mode = params.mode || store.get('app/mode');
  params.app = params.app || store.get('app/code');
  return {
    ...params,
    id: params.id,
    t: store.get("app/token")
  };
};

export const queryPageData = async (params: API.IPageDataParams) => {
  const pageServerUrl = store.get(UrlConfKey.pageServerUrlForApp);
  const isHttp = /http/.test(pageServerUrl);
  // console.log(`${(!isHttp ? 'http://' : '') + pageServerUrl}/node-web/page-data`);
  const res = await $A_R(`${(!isHttp ? 'http://' : '') + pageServerUrl}/node-web/page-data`, {
    method: 'GET',
    params: mergeParam(params)
  });
  return filterRes(res);
};
