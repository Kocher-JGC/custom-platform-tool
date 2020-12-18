import { AdminTemplateEngine, PageRenderCtx } from "@engine/ui-admin-template";
import { AuthSelector } from "@engine/ui-admin-template/components/auth-selector";
import { LoginPanel } from "@engine/ui-admin-template/plugins/default-renderer/login-panel";
import { Button } from "antd";
import React from "react";
import store from "store";
import { connect, Provider } from "unistore/react";
import {
  authActions, authStore,

  AuthStore,

  AuthStoreState, SaaSAuthActionsTypes
} from "./auth/actions";
import { DashboardRender, PageContainer, Version } from "./components";
import SelectApp from "./components/SelectApp";
import { queryMenuList } from "./services";
import "./style";
import { remoteMenu2AppMenu } from "./utils";







function selector(state) {
  return state;
}

const removeLoadingBG = () => {
  const loaderDOM = document.querySelector("#loadingBg");
  if (!loaderDOM || !loaderDOM.parentNode) return;
  loaderDOM.classList.add("loaded");
  loaderDOM.parentNode.removeChild(loaderDOM);
  // setTimeout(() => {
  // }, 100);
};

type LoginFilterProps = AuthStoreState;

class LoginFilter extends React.Component<LoginFilterProps> {
  envConfig = {
    app: "",
    lessee: "",
    t: "",
    appName: "",
  };

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      menuData: [],
    };
    this.setEnvConfig();
  }

  setEnvConfig = () => {
    const app = store.get("app/code");
    const lessee = store.get("app/lessee");
    const t = store.get(`paas/token`);
    const appName = store.get("app/name");

    this.envConfig = {
      app,
      lessee,
      t,
      appName,
    };
  };

  componentDidMount() {
    removeLoadingBG();
  }

  footerRender = () => {
    return (
      <>
        <Version />
        <hr />
        <span className="copy-right">@{new Date().getFullYear()}</span>
      </>
    );
  };

  dashboardRender = () => {
    return (
      <div>
        <DashboardRender />
      </div>
    );
  };

  pageRender = (renderCtx: PageRenderCtx) => {
    const { history } = renderCtx;
    const { query } = history.location;
    const { pageID } = query;
    return (
      <PageContainer
        {...this.envConfig}
        {...renderCtx}
        pageID={pageID}
      ></PageContainer>
    );
  };

  checkAppInfo = () => {
    // const { app } = this.props;
    if (!store.get("app/code")) {
      return this.selectAppPanelRender();
    }
    return this.loginPanelRender();
  };

  selectAppPanelRender = () => {
    const { selectAppInfo } = this.props;
    return <SelectApp selectAppInfo={selectAppInfo} />;
  };

  onLoginSuccess = () => {
    const {getUserLastLoginInfo} = this.props;
    getUserLastLoginInfo();
    queryMenuList().then((menuDataRes) => {
      // TODO: 过滤成内部菜单数据
      const menuData = remoteMenu2AppMenu(menuDataRes.result);
      this.setState({
        menuData,
        ready: true,
      });
    });
  };

  loginPanelRender = () => {
    const { login, logging, autoLoging } = this.props;
    const { appName } = this.envConfig;
    const formOptions = [
      {
        ref: "AdminName",
        type: "input",
        title: "账号",
        iconName: "account",
        required: true,
      },
      {
        ref: "Password",
        type: "password",
        title: "密码",
        iconName: "lock",
        required: true,
      },
    ];
    return (
      <LoginPanel
        backgroundImage="url(./images/bg_1.jpg)"
        login={(value) => {
          login(value, this.onLoginSuccess);
        }}
        btnGColor="red"
        logo={() => <h3>{appName}</h3>}
        logging={logging}
        autoLoging={autoLoging}
        formOptions={formOptions}
      />
    );
  };

  render() {
    const {
      isLogin,
      autoLoging,
      username,
      switchUser,
      switchApp,
      autoLogin,
      lastLoginInfo,
      logout
    } = this.props;
    const { menuData } = this.state;

    return (
      <AuthSelector
        isLogin={isLogin}
        autoLoging={autoLoging}
        didMount={() => {
          autoLogin(this.onLoginSuccess);
        }}
        loginPanelRender={this.checkAppInfo}
      >
        {isLogin ? (
          <AdminTemplateEngine
            // fromBase64={false}
            menuData={menuData}
            // bgStyle={
            //   {
            //     // background: `url(./images/bg/bg_1.jpg)`,
            //     // backgroundColor: '#f3f3f3',
            //     // opacity: 0.1
            //   }
            // }
            statusbarActions={[
              {
                action: () => {},
                title: username,
                overlay: () => {
                  if (store.get("app/mode") !== "preview") {
                    return (
                      <div style={{ width: 300 }}>
                        <div className="p10" style={{color: '#1890ff'}}>
                          账户信息
                        </div>
                        <hr style={{ margin: 0 }} />
                        <div className="p10">本次登录：{lastLoginInfo.lastLoginTime}</div>
                        <div className="p10">上次登录：{lastLoginInfo.createTime}</div>
                        <div className="p10">登录ip：{lastLoginInfo.ip}</div>
                        <hr style={{ margin: 0 }} />
                        <div className="p10">
                          <Button type="link" onClick={logout}>退出登录</Button>
                          <Button type="link" onClick={switchUser}>切换账号</Button>
                          <Button type="link" onClick={switchApp}>切换应用</Button>
                        </div>
                        {/* <div className="p20">修改密码</div> */}
                      </div>
                    );
                  }
                  return null;
                },
              },
            ]}
            appTitle={this.envConfig.appName}
            pluginRenderer={{
              Footer: this.footerRender,
              Dashboard: this.dashboardRender,
            }}
            pageRender={this.pageRender}
          >
            {/* <AppContainer /> */}
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
