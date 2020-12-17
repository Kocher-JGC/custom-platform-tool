import { history } from 'multiple-page-routing';
import React from "react";
import ReactDOM from "react-dom";
import store from "store";
import App from './main';
import { checkEnvConfig } from "./utils/check-env-config";
import { getAppEnvConfig, UrlConfKey } from "./utils/env";
import { initRequest } from "./utils/request";




/**
 * 从 config 获取环境配置
 */
// const getEnvConfigFromRemote = async () => {
//   try {
//     return await getAppEnvConfig();
//   } catch (err) {
//     console.log("获取后端 config 失败", err);
//     return {};
//   }
// };

/**
 * 将 query 的 key 映射到 store 的 key
 */
const queryKeyMapStoreKey = {
  t: "paas/token",
  app: "app/code",
  lessee: "app/lessee",
  appName: "app/name",
  mode: "app/mode",
  [UrlConfKey.saasServerUrl]: "saasServerUrl",
  [UrlConfKey.pageServerUrlForApp]: "pageServerUrlForApp",
};

/**
 * 从 url 获取环境配置
 */
const getEnvConfigFromLocation = () => {
  const { query } = history.location;
  if(!query) return {};
  if(!query.mode && store.get("app/mode") === "preview"){
    store.remove("app/mode");
  }
  const queryKeys = Object.keys(query);
  const params = {};

  if (Array.isArray(queryKeys)) {
    queryKeys.forEach((q) => {
      if (q !== "redirect") {
        const matchStoreKey = queryKeyMapStoreKey[q];
        if(matchStoreKey) {
          params[matchStoreKey] = query[q];
        }
      }
    });
  }
  return params;
};

const initReq = (token?: string) => {
  const saasServerUrl = store.get(UrlConfKey.saasServerUrl);
  initRequest(saasServerUrl, token);
};

/**
 * A. 预览:
 * 1.1 url 有值, 需不需要请求 json?
 *
 * B. 发布:
 * 2.1 url 无值, 需要请求 json,
 * 2.2 但是第一次进入时, 无 mian.json, 应该直接跳转至安装页面
 */
export async function render() {
  // 合并环境配置
  const envConfig = Object.assign(await getAppEnvConfig(), getEnvConfigFromLocation(), {"client_secret": "hy123456","client_id": "client_hy_web"});

  // 判断环境配置的合法性
  const isPass = checkEnvConfig(envConfig);

  if (isPass) {
    Object.keys(envConfig).forEach((field) => {
      store.set(field, envConfig[field]);
    });

  }

  // if(envConfig["app/code"] && envConfig[`app/${envConfig["app/code"]}/token`]){
  //   initReq(envConfig[`app/${envConfig["app/code"]}/token`]);
  // }

  initReq();

  ReactDOM.render(
    <App />,
    document.querySelector("#Main")
  );
}

render();
