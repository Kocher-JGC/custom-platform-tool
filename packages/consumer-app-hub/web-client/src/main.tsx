import React from "react";

import { Provider, connect } from "unistore/react";

/** Components */
import IUBDSLParser from "@iub-dsl/engine";

import { AdminTemplateEngine } from "@engine/ui-admin-template";
import { AuthSelector } from "@engine/ui-admin-template/auth-selector";

import { authStore, authActions, AuthStore, SaaSAuthActionsTypes, AuthStoreState } from "./auth/actions";
// import { PageContainer } from "../PageContainer";

/** API */
import {
  LoadPage, queryMenuList, GetPageAuthConfig, AuthUIByUIID
} from "./services";

import "./style";
import { AppContainer } from "./components";

const loginFormOptions = [
  {
    ref: "AdminName",
    type: "input",
    title: "账号",
    iconName: "account",
    required: true
  },
  {
    ref: "Password",
    type: "password",
    title: "密码",
    iconName: "lock",
    required: true
  },
  {
    ref: "GooglePassword",
    type: "input",
    iconName: "security",
    title: "Google认证码"
  }
];

function selector(state) {
  return state;
}

const pageCache = {};
const pageAuthCache = {};

const appContext = {};

type LoginFilterProps = AuthStoreState

class LoginFilter extends React.Component<LoginFilterProps> {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      navStore: []
    };
  }

  componentDidMount() {
    queryMenuList().then((menuDataRes) => {
      // TODO: 过滤成内部菜单数据
      const menuData = menuDataRes;
      this.setState({
        navStore: menuData,
        ready: true
      });
    });
  }

  render() {
    const { isLogin, userInfo, menuData } = this.props;
    return (
      <AuthSelector
        {...this.props}
        backgroundImage="url(./images/bg/bg_3.jpg)"
        btnGColor="red"
        logo={() => <h3>admin-dashboard</h3>}
        isLogin={isLogin}
        formOptions={loginFormOptions}
      >
        {isLogin ? (
          <AdminTemplateEngine
            versionUrl="./version.json"
            // {...this.props}
            menuData={menuData}
            // 必须填写的
            bgStyle={
              {
                // background: `url(./images/bg/bg_1.jpg)`,
                // backgroundColor: '#f3f3f3',
                // opacity: 0.1
              }
            }
            username={userInfo.username}
            // statusbarConfig={statusbarConfig}
            menuMappers={{
              child: "child",
              code: "code",
              title: "title",
              icon: "icon"
            }}
            title="admin-dashboard"
            // i18nConfig={i18nConfig}
            // pluginComponent={{
            //   Statusbar: Status,
            //   DashBoard,
            //   Footer
            // }}
            // pageComponents={pageComponents}
          >
            <AppContainer />
          </AdminTemplateEngine>
        ) : null}
      </AuthSelector>
    );
  }
}

const LoginFilterWithStore = connect<AuthStore, any, SaaSAuthActionsTypes, any>(
  selector,
  authActions
)((userStore) => <LoginFilter {...userStore} />);

const C = () => (
  <Provider store={authStore}>
    <LoginFilterWithStore />
  </Provider>
);

export default C;
