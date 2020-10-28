/* eslint-disable no-param-reassign */
/**
 * 这里是根据具体业务的处理filter
 */

import { RequestClass, resolveUrl } from "@mini-code/request";
import { message as AntdMessage } from 'antd';

import { clearDefaultParams, onNavigate } from "multiple-page-routing";
import { authStore } from "../auth/actions";

/**
 * 后端返回的数据结构
 */
export interface ResStruct {
  code: string
  message: string
  results?: any
  result?: any
}

const urlPrefix = 'paas';
let baseReqUrl = '';

/**
 * 设置请求平台服务的 api 地址
 */
export const setPlatformApiUrl = (platformApiUrl: string) => {
  baseReqUrl = resolveUrl(platformApiUrl, urlPrefix);
  $R.setConfig({
    baseUrl: baseReqUrl
  });
};

/**
 * 根据业务扩展的 http 请求工具的类型
 */
export interface RExtend extends RequestClass<ResStruct, RequestOptions> {
  urlManager: typeof urlManager
}

export interface RequestOptions {
  /** 业务提示 */
  businessTip: {
    /** 提示的类型 */
    type?: 'error' | 'success' | 'info'
    /** 弹出的提示的类型，是顶部提示或者是右上角提示 */
    tipType?: 'toast' | 'notify'
    /** 当业务编码等于 xx 的时候显示，如果为空，则认为不是成功的业务码都弹出 */
    whenCodeEq?: string
  }
}

const $R = new RequestClass({
  // baseUrl: `${baseReqUrl}`
}) as RExtend;

/**
 * URL 管理器，根据实际业务需求设置 URL
 */
class UrlManager {
  currLessee = ''

  currApp = ''

  /** 登录后需要设置 */
  setLessee = (lessee: string) => {
    this.currLessee = lessee;
    this.setRequestBaseUrl();
  }

  /** 选择应用后需要设置 */
  setApp = (app: string) => {
    this.currApp = app;
    this.setRequestBaseUrl();
  }

  /** 登出的时候需要设置 */
  reset = () => {
    this.currApp = '';
    this.currLessee = '';
    /** 清除默认 params */
    clearDefaultParams();
    $R.setConfig({
      baseUrl: baseReqUrl
    });
  }

  getUrl = () => {
    return resolveUrl(baseReqUrl, this.currLessee, this.currApp);
  }

  setRequestBaseUrl = () => {
    $R.setConfig({
      baseUrl: this.getUrl()
    });
  }
}

const urlManager = new UrlManager();

$R.urlManager = urlManager;

const resetHttpReqHelper = () => {
  $R_P.urlManager.reset();
};

/**
 * 前端应该与服务端的接口分离
 * 通过此方法实现对接远端需要的 request 数据
 */
// const beforeReq = (beforeData) => {
//   console.log('beforeData', beforeData);
//   return beforeData;
// };

/**
 * 前端应该与服务端的接口分离
 * 通过此方法实现对接 response 数据
 */
// const afterRes = (resData, other) => {
//   console.log('resData', resData);
//   console.log('other', other);
//   return resData;
// };

/** 使用 $R 的中间件 */
// $R.useAfter([afterRes]);

/**
 * 统一处理 http 业务码的函数
 */
function handleRes({ res, resDetail }) {
  // return console.log('resData', resData);
  const { code, msg } = res;
  const { businessTip } = resDetail.__originReq;
  if (!businessTip) {
    /** 如果没有配置，默认所有错误都弹出 */
    switch (code) {
      case '00000':
        // console.log('成功');
        break;
      case 'A0300':
        // console.log(resData);
        // 处理没找到应用的业务逻辑
        AntdMessage.error(msg);
        onNavigate({
          type: 'ROOT'
        });
        authStore.setState({ isLogin: false });
        resetHttpReqHelper();
        // onNavigate({
        //   type: 'PUSH',
        //   path: '/login',
        //   useDefaultParams: false
        // });
        break;
      default:
        // TODO: 完善请求
        AntdMessage.error(msg);
    }
  } else {
    const { whenCodeEq, type = 'info' } = businessTip as RequestOptions['businessTip'];
    if (code === whenCodeEq) {
      const antdMsgFunc = AntdMessage[type] || AntdMessage.info;
      antdMsgFunc(msg);
    }
  }
}

const handleErr = (e) => {
  console.log(e);
};

/**
 * 监听 $R res 处理函数
 */
$R.on('onRes', handleRes);

/** 处理网络异常 */
$R.on("onErr", handleErr);

const $request = $R;

export { $request, $R };

export type $Request = typeof $R

declare global {
  const $R_P: typeof $R;
  interface Window {
    /** Request helper for Provider app，简写 R_P，$ 是全局变量前缀, 生产工具的 HTTP 请求助手 */
    $R_P: $Request;
  }
}

/**
 * 定义不可被更改的 $R_P 属性
 */
Object.defineProperties(window, {
  $R_P: {
    get() {
      return $R;
    },
    set() {
      return false;
    }
  }
});
