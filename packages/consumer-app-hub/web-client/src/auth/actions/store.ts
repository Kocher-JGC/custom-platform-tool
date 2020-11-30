/**
 * 用户验证模块
 */
import createStore from "unistore";
import * as localStore from "store";
import { Call, EventEmitter } from "@mini-code/base-func";

import * as AUTH_APIS from "./apis";

export interface SaaSAuthActionsTypes {
  autoLogin: () => void;
  switchUser: () => void;
  switchApp: () => void;
  selectAppInfo: (app: { code: string, lessee: string }) => void;
  login: (form, onSuccess?: () => void) => void;
  logout: () => void;
}

export interface AuthStoreState extends AuthStore, SaaSAuthActionsTypes {

}

export interface AuthStore {
  userInfo: {};
  menuStore: {};
  username: string;
  loginResDesc: string;
  autoLoging: boolean;
  logging: boolean;
  logouting: boolean;
  isLogin: boolean;
  token: string;

  app: IApp | null;
}
export interface IApp {
  name: string;
  code: string;
  lessee: string;
  token: string;
}

export function getPrevLoginToken() {
  const res = getPrevLoginData();
  return res ? res.token : null;
}

export function getAppInfo() {
  if(localStore.get("app/code")){
    return Object.assign(
      {},
      {
        name: localStore.get("app/name"),
        code: localStore.get("app/code"),
        lessee: localStore.get("app/lessee"),
      },
      localStore.get(`app/${localStore.get("app/code")}/token`) && {
        token: localStore.get(`app/${localStore.get("app/code")}/token`),
      });
  }
  // 本地存储数据缺失，清除数据重新登录
  localStore.clearAll();
  return null;
}

const defaultAuthStore: AuthStore = {
  userInfo: {},
  username: "",
  loginResDesc: "",
  autoLoging: !!getPrevLoginToken(),
  logging: false,
  logouting: false,
  // isLogin: false,
  isLogin: process.env.NODE_ENV === 'development',
  token: "",
  menuStore: [],
  app: getAppInfo()
};

const authStore = createStore(defaultAuthStore);

function onLoginSuccess(store, resData) {
  const userInfo = resData;
  const { username } = resData;
  userInfo.username = username;
  // let menuStore = (userInfo.Menus || {}).Child;
  const { token } = resData;
  const { app } = store.getState();
  // delete userInfo['Menus'];
  store.setState({
    logging: false,
    autoLoging: false,
    isLogin: true,
    token,
    username,
    userInfo,
    app: {
      ...app,
      token
    }
    // menuStore
  });

  localStore.set(`app/${app.code}/token`, token);

  EventEmitter.emit("LOGIN_SUCCESS", { userInfo, loginRes: resData });
  // localStorage.setItem("PREV_LOGIN_DATA", JSON.stringify(resData));
}

function clearPrevLoginData() {
  localStorage.clear();
}

function getPrevLoginData(): AuthStore | undefined {
  const res = localStorage.getItem("PREV_LOGIN_DATA");
  let result;
  if (res) {
    try {
      result = JSON.parse(res);
    } catch (e) {
      console.log(e);
    }
  }
  return result;
}

const authActions = (store) => ({
  switchUser(){
    const { app } = store.getState();
    store.setState({
      isLogin: false,
      app: {
        name: app.name,
        code: app.code,
        lessee: app.lessee
      }
    });
    localStore.remove(`app/${app.code}/token`);
  },
  switchApp(){
    store.setState({
      isLogin: false,
      app: null
    });
    localStore.clearAll();
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
      localStore.set("app/code", code);
      localStore.set("app/lessee", lessee);
    }
  },
  async autoLogin() {
    const token = getPrevLoginToken();
    if (!token) return;
    const loginRes = await AUTH_APIS.login({
      token
    });
    const isLogin = loginRes.code === 0;
    if (isLogin) {
      onLoginSuccess(
        store,
        Object.assign({}, getPrevLoginData(), loginRes.data)
      );
    }
    // if (prevLoginData) {
    //   onLoginSuccess(store, prevLoginData);
    // }
  },
  async login(state, form, callback) {
    store.setState({
      logging: true
    });
    const loginRes = await AUTH_APIS.login(form);
    const isLogin = loginRes.code === 0;
    if (isLogin) {
      Call(callback, form);
      onLoginSuccess(store, Object.assign({}, loginRes.data, form));
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
    await AUTH_APIS.logout();
    store.setState(defaultAuthStore);
    clearPrevLoginData();
  }
});

export { authStore, authActions };
