/**
 * 用户验证模块
 */
import { Call, EventEmitter } from "@mini-code/base-func";
import CryptoJS from "crypto-js";
import dayjs from 'dayjs';
import storage from "store";
import createStore from "unistore";
import * as AUTH_APIS from "./apis";


const PREV_LOGIN_DATA = 'prev/login/data';

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
interface refreshTokenInfo {
  refresh_token:string,
  access_token:string, 
  expires_in:string,
  refreshTime:number,
}
// 数据管理
const storageState = {
  getCode:()=>{
    return storage.get("app/code")
  },
  getToken:function(){
    return storage.get(`app/${this.getCode()}/token`)
  },
  getName:()=>{
    return storage.get("app/name")
  },
  getLessee:()=>{
    return storage.get("app/lessee")
  },
  getClientid:()=>{
    return storage.get("client_id")
  },
  getClientSecret:()=>{
    return storage.get("client_secret")
  },
  setToken:function(token:string){
    return storage.set(`app/${this.getCode()}/token`, token)
  },
  setRefreshTokenInfo:function(refreshTokenInfo:refreshTokenInfo){
    return storage.set(`app/${this.getCode()}/refreshTokenInfo`,refreshTokenInfo)
  },
  setIsRefresh:function(isRefreshing:boolean){
    return storage.set(`app/${this.getCode()}/isRefreshing`, isRefreshing);
  },
  setCode:(code:string)=>{
    return storage.set("app/code",code)
  },
  setLessee:(lessee:string)=>{
    return storage.set("app/lessee",lessee)
  },
  removeToken:function(){
    return storage.remove(`app/${this.getCode()}/token`)
  },
  removeCode:()=>{
    return storage.remove("app/code")
  },
  removeLessee:()=>{
    return storage.remove("app/lessee")
  },
  removeName:()=>{
    return storage.remove("app/name")
  },
  removeData:()=>{
    return storage.remove("prev/login/data")
  },
  removePaasToken:()=>{
    return storage.remove("paas/token")
  }
}
export function getPrevLoginToken() {
  const res = getPrevLoginData();
  return res ? res.token : null;
}

export function checkAppInfo() {
  return storageState.getCode() && storageState.getToken();
}

export function getAppInfo() {
  if(storageState.getCode()){
    return Object.assign(
      {},
      {
        name: storageState.getName(),
        code: storageState.getCode(),
        lessee: storageState.getLessee(),
      },
      storageState.getToken() && {
        token: storageState.getToken(),
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

function onLoginSuccess(store, { resData, originForm = {} }) {
  const prevLoginRes = resData;
  const { app } = store.getState();

  /** TODO: 提取页面需要的信息 */


  let { refresh_token, access_token, expires_in, user_info } = resData || {};

  // storage.set(`app/${storage.get("app/code")}/token`, access_token);
  storageState.setToken(access_token);
  storageState.setRefreshTokenInfo({ refresh_token, access_token, expires_in, refreshTime: new Date().getTime()});
  storageState.setIsRefresh(false);

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
  storage.set(PREV_LOGIN_DATA, resData);
  // initRequest(saasServerUrl, token);


  return resultStore;
}

function clearPrevLoginData() {
  // storage.clearAll();
  storageState.removeToken();
  storageState.removeCode();
  storageState.removeLessee();
  storageState.removeName();
  storageState.removePaasToken();
}

function getPrevLoginData(): AuthStore | undefined {
  return storage.get(PREV_LOGIN_DATA);
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
    storageState.removeToken();
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
      storageState.setCode(code);
      storageState.setLessee(lessee);
    }
  },
  async getUserLastLoginInfo(state){
    const lastLoginInfo = await AUTH_APIS.getUserLastLogin({lessee_code: storageState.getLessee(),app_code: storageState.getCode()});
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
    /** 判断是否登录成功的逻辑 */
    const nextStore = onLoginSuccess(store, { resData: prevLoginState });
    store.setState(nextStore);
    Call(onSuccess);
  },
  async login(state, form, onSuccess) {
    store.setState({
      logging: true
    });
    const loginParams:AUTH_APIS.loginParams = {
      username: form.AdminName,
      // password: form.Password,
      password: encrypt(form.AdminName + form.Password, "hy_auth_business"),
      pwd_encryption_type: 2,
      client_type: 4,//终端类型：1为WPF客户端，2为安卓手机客户端，3为苹果手机客户端，4为web浏览器，5其他终端
      lessee_code: storageState.getLessee(),
      app_code: storageState.getCode(),
      client_id: storageState.getClientid(),
      client_secret: storageState.getClientSecret()
    }
    try{
      storageState.removeToken();
      const loginRes = await AUTH_APIS.login(loginParams);
      /** 判断是否登录成功的逻辑 */
      const isLogin = handleLoginSuccess(loginRes);
      if (isLogin) {
        const nextStore = onLoginSuccess(store, { resData: loginRes, originForm: form });
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
    storageState.removeToken();
    storageState.removeData();
  }
});

export { authStore, authActions };

