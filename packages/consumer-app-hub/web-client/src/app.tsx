import React from "react";
import ReactDOM from "react-dom";

import store from "store";
import { history } from 'multiple-page-routing';

import { initRequest } from "./utils/request";
import { getAppEnvConfig, UrlConfKey } from "./utils/env";
import { checkEnvConfig } from "./utils/check-env-config";
import App from './main';

/**
 * 从 config 获取环境配置
 */
const getEnvConfigFromRemote = async () => {
  try {
    const appEnvConfig = await getAppEnvConfig();
    // const mainConf = await getMainConf(appEnvConfig.currentApp);
    // TODO 租户信息的来源
    return {
      ...appEnvConfig
      // "app/code": appEnvConfig.currentApp,
      // "app/lessee": mainConf.lessee
    };
  } catch (err) {
    console.log("获取后端 config", err);
    return {};
  }
};

/**
 * 从 url 获取环境配置
 */
const getEnvConfigFromLocation = () => {
  const { query } = history.location;
  if(!query) return {};
  const queryKeys = Object.keys(query);
  const params = {};

  if (Array.isArray(queryKeys)) {
    if (
      queryKeys.includes("mode") &&
      queryKeys.includes(UrlConfKey.saasServerUrl) &&
      queryKeys.includes(UrlConfKey.pageServerUrlForApp)
    ) {
      queryKeys.forEach((q) => {
        if (q === "t") {
          params["app/token"] = query[q];
        } else if (q === "app") {
          params["app/code"] = query[q];
        } else if (q === "lessee") {
          params["app/lessee"] = query[q];
        } else if (q !== "redirect") {
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
export async function render() {
  // 合并参数
  const envConfig = Object.assign(await getEnvConfigFromRemote(), getEnvConfigFromLocation());
  // 判断参数合法性
  const isPass = checkEnvConfig(envConfig);
  if (isPass) {
    Object.keys(envConfig).forEach((field) => {
      store.set(field, envConfig[field]);
    });
  }
  initReq();
  
  ReactDOM.render(
    <App />,
    document.querySelector("#Main")
  );
}

render();