/**
 * 用户验证模块
 */
import createStore from "unistore";
import storage from "store";
import { Call, EventEmitter } from "@mini-code/base-func";

import * as AUTH_APIS from "./apis";
import { setRequestHeader } from "../../utils/request";

const PREV_LOGIN_DATA = 'prev/login/data';

export interface SaaSAuthActionsTypes {
  autoLogin: (onSuccess?: () => void) => void;
  switchUser: () => void;
  switchApp: () => void;
  selectAppInfo: (app: { code: string, lessee: string }) => void;
  login: (form, onSuccess?: () => void) => void;
  logout: () => void;
}

export interface AuthStoreState extends AuthStore, SaaSAuthActionsTypes {

}

export interface AuthStore {
  userInfo: Record<string, unknown>
  username: string
  loginResDesc: string
  autoLoging: boolean
  logging: boolean
  logouting: boolean
  isLogin: boolean
  token: string

  app: IApp | null
}
export interface IApp {
  name: string
  code: string
  lessee: string
  token: string
}

export function getPrevLoginToken() {
  const res = getPrevLoginData();
  return res ? res.token : null;
}

export function checkAppInfo() {
  return storage.get("app/code") && storage.get(`app/${storage.get("app/code")}/token`);
}

export function getAppInfo() {
  if(storage.get("app/code")){
    return Object.assign(
      {},
      {
        name: storage.get("app/name"),
        code: storage.get("app/code"),
        lessee: storage.get("app/lessee"),
      },
      storage.get(`app/${storage.get("app/code")}/token`) && {
        token: storage.get(`app/${storage.get("app/code")}/token`),
      });
  }
  // 本地存储数据缺失，清除数据重新登录
  storage.clearAll();
  return null;
}

const handleLoginSuccess = (loginRes) => loginRes.code === 'C0000';

const defaultAuthStore: AuthStore = {
  userInfo: {},
  username: "",
  loginResDesc: "",
  autoLoging: !!getPrevLoginToken(),
  logging: false,
  logouting: false,
  isLogin: false,
  // isLogin: process.env.NODE_ENV === 'development',
  token: "",
  app: getAppInfo()
};

const authStore = createStore(defaultAuthStore);

function onLoginSuccess(store, { resData = {}, originForm = {} }) {
  const prevLoginRes = resData;
  const { app } = store.getState();

  /** TODO: 提取页面需要的信息 */
  const { username } = resData;
  /**
   * 提取用户信息
   */
  const userInfo = {
    username
  };

  let { token } = resData || {};

  if(token.indexOf("Bearer") === -1){
    token = `Bearer ${token}`;
  }

  const resultStore = {
    logging: false,
    autoLoging: false,
    isLogin: true,
    token,
    username,
    prevLoginRes,
    userInfo
  };

  storage.set(`app/${storage.get("app/code")}/token`, token);

  setRequestHeader({ Authorization: token });

  EventEmitter.emit("LOGIN_SUCCESS", { userInfo, loginRes: resData });
  storage.set(PREV_LOGIN_DATA, resData);
  // initRequest(saasServerUrl, token);

  return resultStore;
}

function clearPrevLoginData() {
  storage.clearAll();
}

function getPrevLoginData(): AuthStore | undefined {
  return storage.get(PREV_LOGIN_DATA);
}

const authActions = (store) => ({
  switchUser(){
    const { app } = store.getState();
    store.setState({
      isLogin: false,
      logging: false,
      app: {
        name: app.name,
        code: app.code,
        lessee: app.lessee
      }
    });
    storage.remove(`app/${app.code}/token`);
  },
  switchApp(){
    store.setState({
      isLogin: false,
      logging: false,
      app: null
    });
    storage.clearAll();
  },
  selectAppInfo(state, appInfo){
    const { code, lessee } = appInfo;
    if(code && lessee){
      const { app } = store.getState();
      store.setState({
        app:{
          ...app,
          code,
          lessee
        }
      });
      storage.set("app/code", code);
      storage.set("app/lessee", lessee);
    }
  },
  async autoLogin(state, onSuccess) {
    const prevLoginState = getPrevLoginData();
    if (!prevLoginState) return;
    store.setState({
      autoLoging: true,
    });
    /** 判断是否登录成功的逻辑 */
    const nextStore = onLoginSuccess(store, { resData: prevLoginState });
    store.setState(nextStore);
    Call(onSuccess);
  },
  async login(state, form, onSuccess) {
    store.setState({
      logging: true
    });
    const loginRes = await AUTH_APIS.login(form);
    /** 判断是否登录成功的逻辑 */
    const isLogin = handleLoginSuccess(loginRes);
    if (isLogin) {
      Call(onSuccess, form);
      const nextStore = onLoginSuccess(store, { resData: loginRes.data, originForm: form });
      store.setState(nextStore);
    } else {
      store.setState({
        logging: false,
        loginResDesc: loginRes.message
      });
    }
  },
  async logout() {
    store.setState({
      logouting: true
    });
    // await AUTH_APIS.logout();
    store.setState({
      ...defaultAuthStore,
      isLogin: false,
      autoLoging: false,
      logging: false,
      logouting: false,
    });
    clearPrevLoginData();
  }
});

export { authStore, authActions };
