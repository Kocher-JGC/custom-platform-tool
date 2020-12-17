/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
// import { extend } from 'umi-request';
import { notification } from 'antd';
import axios, { AxiosInstance } from 'axios';
import storage from 'store';
import refreshToken from './refreshToken';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};
// 数据管理
const requestState = {
  getCode:()=>{
    return storage.get("app/code")
  },
  getToken:function(){
    return storage.get(`app/${this.getCode()}/token`)
  }
}

// 请求前设置请求头
const beforeRequest = (request:AxiosInstance)=>{
  request.interceptors.request.use(
    config => {
      const tokenId = requestState.getToken();
      if (tokenId) {
        config.headers.common["Authorization"] = "Bearer " + tokenId;
      }
  
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
}

// 响应头拦截处理
const beforeResponse = (request:AxiosInstance, baseURL:string)=>{
  request.interceptors.response.use(
    response => {
      return Promise.resolve(response.data);
    },
    error => {
      try{
        let errCode = -1;
        console.log(error,error.response)
        if(error.response){
          errCode = error.response.status;
        }
        if(errCode == 401 && error.response.config.url != '/auth/login'){
          return refreshToken.checkStatus(error.response, baseURL);
        } else {
          return Promise.reject('');
        }
      }catch(e){
        return Promise.reject('');
      }
      
      
    }
  );
}


export const initRequest = (baseURL:string, token:string) => {
  if (window.$A_R) return;

  /**
   * 配置request请求时的默认参数
   */
  const request = axios.create({
    baseURL,
    // errorHandler, // 默认错误处理
    // credentials: 'same-origin', // 默认请求是否带上cookie
    headers: Object.assign({}, token && {
      // Authorization: `${store.get("app/token")}`
      Authorization: token.indexOf("Bearer") !== -1 ? token: `Bearer ${token}`
    }),
  });
  
  beforeRequest(request);
  
  beforeResponse(request, baseURL);
  

  /**
   * 定义不可被更改的 $R_P 属性
   */
  Object.defineProperties(window, {
    $A_R: {
      get() {
        return request;
      },
      set() {
        return false;
      }
    }
  });
};

export const setRequestHeader = (headers) => {
  Object.keys(headers).forEach((key)=>{
    $A_R.defaults.headers.common[key] = headers[key];
  });
};

declare global {
  /** 应用端的请求对象，application request */
  const $A_R: AxiosInstance;
  interface Window {
    /** 应用端的请求对象，application request */
    $A_R: AxiosInstance;
  }
}
