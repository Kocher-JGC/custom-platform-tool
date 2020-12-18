/**
 * 用户验证模块
 */
import { Call, EventEmitter } from "@mini-code/base-func";
import CryptoJS from "crypto-js";
import dayjs from 'dayjs';
import createStore from "unistore";
import { getAppName, getClientId, getClientSecret, getCode, getLessee, getPrevLoginData, getRefreshTokenInfo, getToken, removeAppName, removeCode, removeLessee, removeLoginData, removePaasToken, removeToken, setCode, setIsRefresh, setLessee, setPrevLoginData, setRefreshTokenInfo, setToken } from "./../../utils/store-state-manager";
import * as AUTH_APIS from "./apis";


export interface SaaSAuthActionsTypes {
  autoLogin: (onSuccess?: () => void) => void;
  switchUser: () => void;
  switchApp: () => void;
  selectAppInfo: (app: { code: string, lessee: string }) => void;
  login: (form, onSuccess?: () => void) => void;
  logout: () => void;
  getUserLastLoginInfo:() => void;
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

  app: IApp | null,
  lastLoginInfo: ILastLogin
}
export interface ILastLogin {
  ip: string
  createTime: string
  lastLoginTime: string
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
  return getCode() && getToken();
}

export function getAppInfo() {
  if(getCode()){
    return Object.assign(
      {},
      {
        name: getAppName(),
        code: getCode(),
        lessee: getLessee(),
      },
      getToken() && {
        token: getToken(),
      });
  }
  // 本地存储数据缺失，清除数据重新登录
  // storage.clearAll();
  clearPrevLoginData();
  return null;
}

const handleLoginSuccess = (loginRes) => loginRes;

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
  app: getAppInfo(),
  lastLoginInfo: {
    ip:'',
    createTime:'',
    lastLoginTime:''
  }
};

const authStore = createStore(defaultAuthStore);

function onLoginSuccess(store, { resData, refreshTime, originForm = {} }) {
  const prevLoginRes = resData;
  const { app } = store.getState();

  /** TODO: 提取页面需要的信息 */


  let { refresh_token, access_token, expires_in, user_info } = resData || {};

  // storage.set(`app/${storage.get("app/code")}/token`, access_token);
  setToken(access_token);
  setRefreshTokenInfo({ refresh_token, access_token, expires_in, refreshTime});
  setIsRefresh(false);

  const resultStore = {
    logging: false,
    autoLoging: false,
    isLogin: true,
    token:access_token,
    username: user_info.username,
    prevLoginRes,
    userInfo:user_info
  };


  EventEmitter.emit("LOGIN_SUCCESS", { userInfo:user_info, loginRes: resData });
  setPrevLoginData(resData);
  // initRequest(saasServerUrl, token);


  return resultStore;
}

function clearPrevLoginData() {
  // storage.clearAll();
  removeToken();
  removeCode();
  removeLessee();
  removeAppName();
  removePaasToken();
}

// 加密函数
function encrypt(word: string, keyStr: string) {
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
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
    removeToken();
  },
  switchApp(){
    store.setState({
      isLogin: false,
      logging: false,
      app: null
    });
    // storage.clearAll();
    clearPrevLoginData();
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
      setCode(code);
      setLessee(lessee);
    }
  },
  async getUserLastLoginInfo(state){
    const lastLoginInfo = await AUTH_APIS.getUserLastLoginInfo({lessee_code: getLessee(),app_code: getCode()});
    const {
      ip,
      createTime,
      lastLoginTime
    } = lastLoginInfo || {};
    store.setState({
      lastLoginInfo: {
        ip,
        createTime:dayjs(createTime).format('YYYY-MM-DD HH:mm:ss'),
        lastLoginTime:dayjs(lastLoginTime).format('YYYY-MM-DD HH:mm:ss'),
      }
    })
  },
  async autoLogin(state, onSuccess) {
    const prevLoginState = getPrevLoginData();
    if (!prevLoginState) return;
    store.setState({
      autoLoging: true,
    });
    const refreshTokenInfo = getRefreshTokenInfo();
    /** 判断是否登录成功的逻辑 */
    const nextStore = onLoginSuccess(store, { resData: prevLoginState, refreshTime: refreshTokenInfo.refreshTime});
    store.setState(nextStore);
    Call(onSuccess);
  },
  async login(state, form, onSuccess) {
    store.setState({
      logging: true
    });
    const loginParams:AUTH_APIS.LoginParams = {
      username: form.AdminName,
      // password: form.Password,
      password: encrypt(form.AdminName + form.Password, "hy_auth_business"),
      pwd_encryption_type: 2,
      client_type: 4,//终端类型：1为WPF客户端，2为安卓手机客户端，3为苹果手机客户端，4为web浏览器，5其他终端
      lessee_code: getLessee(),
      app_code: getCode(),
      client_id: getClientId(),
      client_secret: getClientSecret()
    }
    try{
      removeToken();
      const loginRes = await AUTH_APIS.login(loginParams);
      /** 判断是否登录成功的逻辑 */
      const isLogin = handleLoginSuccess(loginRes);
      if (isLogin) {
        const nextStore = onLoginSuccess(store, { resData: loginRes, originForm: form, refreshTime:new Date().getTime() });
        store.setState(nextStore);
        Call(onSuccess, form);
      } else {
        store.setState({
          logging: false,
          loginResDesc: loginRes
        });
      }
    }catch(e){
      store.setState({
        logging: false,
        loginResDesc: e
      });
    }
    

  },
  async logout() {
    store.setState({
      logouting: true
    });
    await AUTH_APIS.logout();
    store.setState({
      ...defaultAuthStore,
      isLogin: false,
      autoLoging: false,
      logging: false,
      logouting: false,
    });
    removeToken();
    removeLoginData();
  }
});

export { authStore, authActions };

