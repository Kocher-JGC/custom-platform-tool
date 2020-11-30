import React from "react";
import { PageLoading } from "@ant-design/pro-layout";
import { Redirect, connect, Dispatch, history } from "umi";
import { stringify } from "querystring";
import { ConnectState } from "@/models/connect";
import { IUserModelState } from "@/models/user";
import { IAppModelState } from "@/models/app";
import { getQueryByParams } from "@/utils/utils";
import store from "store";

interface SecurityLayoutProps {
  loading?: boolean;
  currentUser?: IUserModelState;
  app?: IAppModelState;
  dispatch: Dispatch;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.PureComponent<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { query } = history.location;
    const { appName, t } = query;
    // @TODO 暂时这么写
    if (appName) {
      store.set("app/name", appName);
      dispatch({
        type: "settings/changeSetting",
        payload: {
          title: appName
        }
      });
    }
    if (t) {
      store.set("app/providerAppToken", t);
    }
    // if (!mode) {
    //   dispatch({
    //     type: 'user/fetchUserInfo',
    //   });
    // }
    this.setState({
      isReady: true
    });

    // if (dispatch) {
    //   dispatch({
    //     type: 'user/fetchUserInfo',
    //   });
    // }
  }

  render() {
    const { isReady } = this.state;
    const {
      children,
      loading,
      currentUser,
      app,
      location: { pathname }
    } = this.props;
    const isLogin = currentUser && currentUser.token;
    const queryLink = getQueryByParams(["mode", "app", "lessee"]);
    const queryString = stringify({
      redirect: window.location.href
    });
    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    // 判断如果没有选中应用，跳转到应用列表
    console.log(!app?.currentApp?.applicationCode, pathname);
    if (!app?.currentApp?.applicationCode && pathname.indexOf("/user/app-list") === -1) {
      return <Redirect to="/user/app-list" />;
    }
    if (!isLogin && window.location.pathname !== "/user/login") {
      return <Redirect to={`/user/login?${queryString}&${queryLink}`} />;
    }

    return children;
  }
}

export default connect(({ user, app, loading }: ConnectState) => ({
  app,
  currentUser: user,
  loading: loading.models.user
}))(SecurityLayout);
