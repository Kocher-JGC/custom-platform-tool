import store from 'store';
import { history } from 'umi';
import { initRequest } from './utils/request';
import { getAppEnvConfig, getMainConf, UrlConfKey } from './utils/env';
import { checkEnvConfig } from './utils/check-env-config';

/**
 * 获取后端 config 和 main 的数据
 */
const getAppParams = async () => {
  try {
    const appEnvConfig = await getAppEnvConfig();
    const mainConf = await getMainConf(appEnvConfig.currentApp);
    // TODO 租户信息的来源
    return {
      ...appEnvConfig,
      "app/code": appEnvConfig.currentApp,
      "app/lessee": mainConf.lessee,
    };
  } catch(err) {
    console.log("获取后端 config 和 main 的数据失败", err);
    return {};
  }
};

/**
 * 获取所有 url 的 query 的数据
 */
const getQueryParams = () => {
  const { query } = history.location;
  const queryKeys = Object.keys(query);
  console.log(history, query);
  const params = {};

  if (Array.isArray(queryKeys)) {
    if (queryKeys.includes('mode') && queryKeys.includes(UrlConfKey.saasServerUrl) && queryKeys.includes(UrlConfKey.pageServerUrlForApp)) {
      queryKeys.forEach((q) => {
        if (q === 't') {
          params['app/token'] = query[q];
        } else if (q === 'app') {
          params['app/app'] = query[q];
        } else if (q === 'lessee') {
          params['app/lessee'] = query[q];
        } else if(q !== 'redirect') {
          params[q] = query[q];
        }
      });
    }
  }

  return params;
};

const initReq = () => {
  const saasServerUrl = store.get(UrlConfKey.saasServerUrl);
  initRequest(saasServerUrl);
};

/**
 * A. 预览:
 * 1.1 url 有值, 需不需要请求 json?
 *
 * B. 发布:
 * 2.1 url 无值, 需要请求 json,
 * 2.2 但是第一次进入时, 无 mian.json, 应该直接跳转至安装页面
 */
export async function render(oldRender) {
  // 合并参数
  const params = Object.assign(await getAppParams(), getQueryParams());
  // 判断参数合法性
  const isPass = checkEnvConfig(params);
  if(isPass){
    Object.keys(params).forEach(field => {
      store.set(field,params[field]);
    });
  }
  initReq();
  oldRender();
}
