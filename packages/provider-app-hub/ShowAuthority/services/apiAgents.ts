import {
  getShowAuthorities as getShowAuthoritiesApi,
  getShowAuthoritiesTree as getShowAuthoritiesTreeApi
} from './apis';
import { API_CODE } from '../constants';

/** 查询权限树详情 */
export async function getShowAuthorities(param) {
  const res = await getShowAuthoritiesApi(param);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return { total: 0, data: [] };
  }
  return res?.result;
}

/** 查询模块列表 */
export async function getShowAuthoritiesTree(param) {
  const res = await getShowAuthoritiesTreeApi({ ...param });
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return [];
  }
  return res?.result;
}
