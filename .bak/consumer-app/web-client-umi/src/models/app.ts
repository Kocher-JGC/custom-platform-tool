import { Effect, Reducer } from "umi";

import { queryInstallApp } from "@/services/app";
import store from "store";

export interface IApplicationItem {
  type?: string;
  lesseeCode?: string;
  applicationCode?: string;
}
export interface IAppModelState {
  currentApp: IApplicationItem;
  applications: IApplicationItem[];
}

export interface IAppModel {
  namespace: "app";
  state: IAppModelState;
  effects: {
    fetchInstallApp: Effect;
  };
  reducers: {
    setCurrentApp: Reducer<IAppModelState>;
    setInstallApplications: Reducer<IAppModelState>;
  };
}
const initState: IAppModelState = {
  currentApp: { lesseeCode: store.get("app/code"), applicationCode: store.get("app/lessee") },
  applications: []
};
const UserModel: IAppModel = {
  namespace: "app",

  state: initState,

  effects: {
    *fetchInstallApp({ payload }, { call, put }) {
      const response = yield call(queryInstallApp);
      yield put({
        type: "setInstallApplications",
        payload: { applications: Object.values(response?.data || {}) }
      });
    }
  },

  reducers: {
    /**
     * 保存用户信息
     * @param state
     * @param param1
     */
    setCurrentApp(state, { payload }) {
      console.log("payload", payload);
      store.set("app/lessee", payload.currentApp?.lesseeCode);
      store.set("app/code", payload.currentApp?.applicationCode);
      return {
        ...state,
        ...(payload || {})
      };
    },
    setInstallApplications(state, { payload }) {
      return {
        ...state,
        ...(payload || {})
      };
    }
  }
};

export default UserModel;
