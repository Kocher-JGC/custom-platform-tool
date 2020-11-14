import {
  getShowAuthorities as getShowAuthoritiesApi,
  getShowAuthoritiesTree as getShowAuthoritiesTreeApi,
  getAuthorityItemsTree as getAuthorityItemsTreeApi,
  getShowAuthDetail as getShowAuthDetailApi,
  createShowAuth as createShowAuthApi,
  updateShowAuth as updateShowAuthApi,
  allowDeleteShowAuth as allowDeleteShowAuthApi,
  deleteShowAuth as deleteShowAuthApi,
  batchCreateAuth as batchCreateAuthApi
} from './apis';
import { API_CODE, MESSAGE } from '../constants';

/** 查询展示权限，列表 */
export async function getShowAuthorities(param) {
  const res = await getShowAuthoritiesApi(param);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return { total: 0, data: [] };
  }
  return res?.result;
}

/** 查询展示权限，树 */
export async function getShowAuthoritiesTree(param) {
  const res = await getShowAuthoritiesTreeApi(param);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return [];
  }
  return res?.result;
}

/** 查询权限项，树 */
export async function getAuthorityItemsTree(param) {
  const res = await getAuthorityItemsTreeApi({ ...param, selectType: 0 });
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return [];
  }
  return res?.result;
}

/** 查询权限展示树，详情 */
export async function getShowAuthDetail(param) {
  const res = await getShowAuthDetailApi(param);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return {};
  }
  return res?.result;
}

/** 查询权限展示树，详情 */
export async function createShowAuth(param) {
  const res = await createShowAuthApi(param);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return false;
  }
  return true;
}

/** 查询权限展示树，详情 */
export async function updateShowAuth(param) {
  const res = await updateShowAuthApi(param);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return false;
  }
  return true;
}

/** 查询权限展示树，详情 */
export async function allowDeleteShowAuth(param) {
  const res = await allowDeleteShowAuthApi(param);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return { allowDelete: false, title: MESSAGE.ALLOW_DELETE_FAILED };
  }
  const allowDelete = res.result?.allowedDeleted;
  let title = `${res.result?.errorMsg?.map((item) => item.msg).join('，')}`;
  title = title ? `${title}，` : '';
  return {
    allowDelete,
    title: allowDelete ? title + MESSAGE.MAY_I_DELETE : title + MESSAGE.NOT_ALLOW_DELETE
  };
}

/**
 * 删除权限展示树
 * @param params 条件
 */
export async function deleteShowAuthItem({ id }) {
  const res = await deleteShowAuthApi([id]);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return false;
  }
  return true;
}
/**
 * 删除权限展示树
 * @param params 条件
 */
export async function batchCreateAuth(data) {
  const res = await batchCreateAuthApi(data);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return false;
  }
  return true;
}
