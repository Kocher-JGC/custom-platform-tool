import { history } from 'umi';
import store from 'store';
import { initRequest } from './utils/request';
import { usedConfKeys, getUrlConf, getMainConf, UrlConfKey } from './utils/env';

const firstUpperCase = (str: string) => str.replace(/^\S/, (s) => s.toUpperCase());

/**
 * 储存query或者conf.json配置
 */
const setHostEnv = async () => {
  const urlConf = await getUrlConf();
  // TODO: 临时做法, 如果报错就安装应用
  let mainConf = {}
  try {
    mainConf = await getMainConf();
  } catch(e) {
    window.location.href = `/update-app?api=${store.get(UrlConfKey.saasServerUrl)}`
  }
  usedConfKeys.forEach((key) => {
    const val = store.get(key);
    /** store没有该配置设置对应配置 */
    if (!val) {
      const newVal = urlConf[key] || mainConf[key]
      if (newVal) {
        store.set(key, newVal[key]);
      }
    }
  });

  const saasServerUrl = store.get(UrlConfKey.saasServerUrl);
  initRequest(saasServerUrl);
};

/**
 * 储存所有url的query的数据
 */
const saveQueryParam = () => {
  const { query } = history.location;
  console.log(query);
  const queryKeys = Object.keys(query)
  if (queryKeys.length) {
    // TODO: 不是个很保险的办法
    if (queryKeys.includes('mode') && queryKeys.includes('pageServerUrl') && queryKeys.includes('saasServerUrl')) {
      queryKeys.forEach((q) => {
        if (q === 't') {
          store.set('token', query[q]);
        }
        store.set(q, query[q]);
      });
      return true
    } else {
      store.clearAll()
    }
  }
  return false
};

/**
 * 预览: 
 * 1. url有值, 需不需要请求json?
 * 发布:
 * url无值, 需要请求json,
 * 但是第一次进入时, 无mian.json, 应该直接跳转至安装页面
 */
export async function render(oldRender) {
  const shouldSave = saveQueryParam(); // 储存URL上的配置
  if (!shouldSave) { // 应用预览的时候url有值不需要获取json
    await setHostEnv(); // 设置conf的配置
  }
  oldRender();
}
