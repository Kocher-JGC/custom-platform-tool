/**
 * Author: Alex Zhang
 * Desc: 此文件为生成环境的主要入口文件
 */

import React from "react";
import { Provider, connect } from "unistore/react";

import { AuthSelector } from "@infra/auth-selector/selector";
import { LoginPanelThemeMinimal } from "@infra/auth-selector/login-panel";
import { redirectToRoot } from "multiple-page-routing";
import {
  authStore, authActions, AuthStore, PaaSAuthActionsTypes, AuthStoreState
} from "./auth/actions";
import Style from './style/style';
import App from "./app";
import CatchError from "./components/CatchError";

const defaultLang = navigator.language || navigator.userLanguage;

const i18nConfig = {
  "zh-CN": "中文",
  "en-US": "English"
};

function selector(state) {
  return state;
}

const loginFormOptions = [
  {
    ref: "loginName",
    type: "input",
    title: "账号",
    iconName: "account",
    defaultValue: 'hy',
    required: true
  },
  {
    ref: "password",
    type: "password",
    title: "密码",
    defaultValue: '123456',
    iconName: "lock",
    required: true
  },
];

const removeLoadingBG = () => {
  const loaderDOM = document.querySelector("#loadingBg");
  if (!loaderDOM || !loaderDOM.parentNode) return;
  loaderDOM.classList.add("loaded");
  loaderDOM.parentNode.removeChild(loaderDOM);
  // setTimeout(() => {
  // }, 100);
};

type LoginFilterProps = AuthStoreState

class LoginFilter extends React.Component<LoginFilterProps> {
  componentDidMount = () => {
    const { autoLogin, isLogin } = this.props;
    if (!isLogin) redirectToRoot();
    autoLogin();
    // Call(window.OnLuanched);
    removeLoadingBG();
  }

  onLoginSuccess = () => {}

  loginPanelRender = () => {
    const { login, logging, autoLoging } = this.props;
    return (
      <LoginPanelThemeMinimal
        backgroundImage="url(./images/bg/bg_3.jpg)"
        login={(value)=>{
          login(value, this.onLoginSuccess);
        }}
        btnGColor="blue"
        logo={() => <h3 style={{ fontSize: 24 }}>自定义平台 3.0</h3>}
        logging={logging}
        autoLoging={autoLoging}
        formOptions={loginFormOptions}
      />
    );
  }

  render() {
    const { isLogin } = this.props;
    // isLogin = process.env.NODE_ENV === "development" ? true : isLogin;
    return (
      <AuthSelector
        isLogin={isLogin}
        loginPanelRender={this.loginPanelRender}
      >
        {
          isLogin ? (
            <App {...this.props} />
          ) : null
        }
      </AuthSelector>
    );
  }
}
const LoginFilterWithStore = connect<AuthStore, any, PaaSAuthActionsTypes, any>(
  selector,
  authActions
)((userStore) => <LoginFilter {...userStore} />);

const C = () => (
  <>
    <Provider store={authStore}>
      <LoginFilterWithStore />
    </Provider>
    <CatchError />
    <Style/>
  </>
);

// export default hot(module)(C);
export default C;
