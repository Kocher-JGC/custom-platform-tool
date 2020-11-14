import { history } from 'umi';
import store from 'store';
import { initRequest } from './utils/request';
import { usedConfKeys, getUrlConf, getMainConf } from './utils/env';

const firstUpperCase = (str: string) => str.replace(/^\S/, (s) => s.toUpperCase());

/**
 * 储存query或者conf.json配置
 */
const setHostEnv = async () => {
  const urlConf = await getUrlConf();
  const mainConf = await getMainConf();
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

  const saasServerUrl = store.get('saasServerUrl');
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
    } else {
      store.clearAll()
    }
  }
};

export async function render(oldRender) {
  saveQueryParam(); // 储存URL上的配置
  await setHostEnv(); // 设置conf的配置
  oldRender();
}
