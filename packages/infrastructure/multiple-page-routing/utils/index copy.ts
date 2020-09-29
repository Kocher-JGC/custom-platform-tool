import { createBrowserHistory, Location } from "history";
import produce from "immer";
import { urlParamsToQuery, getUrlParams, UrlParamsRes } from "@mini-code/request/url-resolve";

export interface NavParams {
  [key: string]: any;
}

export interface NavigateConfig {
  /** 从哪里来，由程序写入 */
  from?: Location
  /** 路由参数 */
  params?: NavParams
  /** 路由类型 */
  type: 'PUSH' | 'GO_BACK' | 'LINK' | 'POP'
  /** 需要跳转的路由 */
  route: string
  /** 是否使用默认的 params，会在 url 中加入 */
  useDefaultParams?: boolean
}

export const history = createBrowserHistory();

/** 默认存放路由 key 的 url query 字段 */
let ROUTE_KEY = "_R";
export const changeRouteKey = (routeKey: string) => {
  ROUTE_KEY = routeKey;
};

/**
 * 获取 ROUTE_KEY
 */
export const getRouteKey = () => ROUTE_KEY;

/**
 * push to history
 */
export const pushToHistory = (url: string, params?) => {
  history.push(url.replace(/\/\//g, "/"), params);
};

/**
 * replace history
 */
export const replaceHistory = (url: string, params?) => {
  history.replace(url.replace(/\/\//g, "/"), params);
};

let _defaultParams = {};

/**
 * 为每次路由调整添加默认的 params url
 */
export const setDefaultParams = (
  defaultParams: NavParams
) => {
  _defaultParams = produce(defaultParams, (draft) => {
    return {
      ...draft,
      ...defaultParams
    };
  });
};

/**
 * 包装通过 push 方式的 url 格式
 */
export const wrapPushUrl = (pushConfig: NavigateConfig) => {
  const { href, hash } = window.location;
  const targetHash = hash.replace("#/", "").split("?")[0];
  const { route, params, useDefaultParams = true } = pushConfig;
  let result = urlParamsToQuery({
    params: Object.assign({}, params,
      useDefaultParams && _defaultParams,
      {
        [ROUTE_KEY]: route
      }),
    toBase64: true,
  });
  result = `${targetHash}${result.replace(/&$/g, "")}`;
  return result;
};

export type OnNavigate = (config: NavigateConfig) => void

/**
 * 设置导航器
 */
export const clearDefaultParams = () => {
  _defaultParams = {};
};

/**
 * 导航器
 */
export const onNavigate: OnNavigate = (config) => {
  if (!config) {
    throw Error('需要传入 config，请检查调用');
  }
  const { location } = history;
  const nextConfig = produce(config, (draft) => {
    // eslint-disable-next-line no-param-reassign
    draft.from = location;
  });
  const { type } = nextConfig;
  switch (type) {
    case "PUSH":
      pushToHistory(`#/${wrapPushUrl(nextConfig)}`, nextConfig);
      break;
    case "LINK":
      break;
    case "POP":
    case "GO_BACK":
      history.goBack();
      break;
    default:
      throw Error(`没找到类型 ${type}`);
  }
};
