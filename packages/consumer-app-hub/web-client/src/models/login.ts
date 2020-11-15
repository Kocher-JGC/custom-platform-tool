/* eslint-disable camelcase */
import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import store from 'store';
import { accountLogin } from '@/services/login';
import { getPageQuery, getQueryByParams } from '@/utils/utils';

export interface ILoginModelState {
  message?: string;
  token?: string;
  refreshToken?: string;
}

export interface ILoginModelAction {
  payload: API.ILoginType;
}

export interface ILoginModel {
  namespace: string;
  state: ILoginModelState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    setLoginInfo: Reducer<ILoginModelState>;
    setLoginMessage: Reducer<ILoginModelState>;
  };
}
const initState: ILoginModelState = {
  message: "",
};
const Model: ILoginModel = {
  namespace: 'login',
  state: initState,
  effects: {
    /**
     * 用户登录
     * 成功: 进入 / 页面
     * 失败: 设置错误信息
     */
    * login({ payload }, { call, put, select }) {
      try {
        const response: API.ILoginType = yield call(accountLogin, payload);
        yield put({
          type: 'setLoginInfo',
          payload: response,
        });
        return response;
      } catch (e) {
        yield put({
          type: 'setLoginMessage',
          payload: e.message,
        });
        return e;
      }
    },
    /**
     * 用户退出
     */
    logout() {
      const {
        redirect, mode, app, lessee
      } = getPageQuery();
      store.remove("token");
      store.remove("refreshToken");
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
            mode,
            app,
            lessee
          }),
        });
      }
    },
  },

  reducers: {
    setLoginInfo(state: ILoginModelState = initState, { payload }): ILoginModelState {
      const { access_token, refresh_token } = payload?.data || {};
      const { t: providerAppToken } = getPageQuery();
      store.set("app/token", access_token);
      store.set("app/refreshToken", refresh_token);
      store.set("app/providerAppToken", providerAppToken);
      return {
        ...state,
        ...payload,
      };
    },
    setLoginMessage(state: ILoginModelState = initState, { payload }): ILoginModelState {
      state.message = payload;
      return state;
    },
  },
};

export default Model;
