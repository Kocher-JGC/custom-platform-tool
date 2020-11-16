import { history } from 'umi';
import store from 'store';
import { initRequest } from './utils/request';
import { usedConfKeys, getAppEnvConfig, getMainConf, UrlConfKey } from './utils/env';
import { checkEnvConfig, showFetchMainJsonError } from './utils/check-env-config';

// const firstUpperCase = (str: string) => str.replace(/^\S/, (s) => s.toUpperCase());

/**
 * 储存query或者conf.json配置
 */
const setHostEnv = async () => {
  const appEnvConfig = await getAppEnvConfig();
  // TODO: 临时做法, 如果报错就安装应用

  const mainConf = await getMainConf(appEnvConfig.currentApp);
  const isPass = checkEnvConfig(appEnvConfig, mainConf);

  // try {
  //   mainConf = await getMainConf(appEnvConfig.currentApp);
  // } catch(e) {
  //   showFetchMainJsonError();
  //   // window.location.href = `/app-installation?api=${store.get(UrlConfKey.saasServerUrl)}`
  // }

  /**
   * ！！！这里采用明确的设置 store 的方式！！！
   * 不再采用隐式的赋值
   */

  if(isPass){
    store.set('app/code', appEnvConfig.currentApp);
    store.set('app/lessee', mainConf.lessee);
    store.set('saasServerUrl', appEnvConfig.saasServerUrl);
    store.set('pageServerUrlForApp', appEnvConfig.pageServerUrlForApp);
  }

  // Object.keys(appEnvConfig).forEach((key) => {
  //   const val = store.get(key);
  //   /** store没有该配置设置对应配置 */
  //   if (!val) {
  //     const newVal = appEnvConfig[key] || mainConf[key]
  //     if (newVal) {
  //       store.set(key, newVal);
  //       // TODO: 做了更改，去除了 [key] ，观察影响
  //       // store.set(key, newVal[key]);
  //     }
  //   }
  // });
};

/**
 * 储存所有url的query的数据
 */
const saveQueryParam = () => {
  const { query } = history.location;
  // console.log(query);
  const queryKeys = Object.keys(query);
  if (queryKeys.length) {
    // TODO: 不是个很保险的办法
    if (queryKeys.includes('mode') && queryKeys.includes(UrlConfKey.saasServerUrl) && queryKeys.includes(UrlConfKey.pageServerUrlForApp)) {
      queryKeys.forEach((q) => {
        if (q === 't') {
          store.set('app/token', query[q]);
        } else if (q === 'app') {
          store.set('app/code', query[q]);
        } else if (q === 'lessee') {
          store.set('app/lessee', query[q]);
        } else {
          store.set(q, query[q]);
        }
      });
      return true;
    } else {
      store.clearAll();
    }
  }
  return false;
};

const initReq = () => {
  const saasServerUrl = store.get(UrlConfKey.saasServerUrl);
  initRequest(saasServerUrl);
};

/**
 * A. 预览:
 * 1.1 url有值, 需不需要请求json?
 *
 * B. 发布:
 * 2.1 url无值, 需要请求json,
 * 2.2 但是第一次进入时, 无mian.json, 应该直接跳转至安装页面
 */
export async function render(oldRender) {
  const shouldSave = saveQueryParam(); // 储存URL上的配置
  if (!shouldSave) { // 应用预览的时候url有值不需要获取json
    await setHostEnv(); // 设置conf的配置
  }
  initReq();
  oldRender();
}
