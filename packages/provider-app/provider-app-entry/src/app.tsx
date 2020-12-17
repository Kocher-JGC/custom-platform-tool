import React from "react";

import {
  MultipleRouterManager,
  Link,
  defaultState as defaultRouteState,
  RouterState,
  RouterHelperProps,
  onNavigate,
  resolvePagePathWithSeperator,
  redirectToRoot,
  setDefaultParams,
  DefaultLocationState,
} from "multiple-page-routing";
import { Location } from "history";
import { Icon } from "@deer-ui/core/icon";

/** 获取路由配置 */
import { Dashboard } from "@provider-app/dashboard/main";
import Router, { getRouteName } from "@provider-app/config/router";
import { LoadingTip } from "@provider-ui/loading-tip";
import classnames from "classnames";
import { Version } from "./components/Version";

import {
  // Hall,
  PageContainer,
  Nav,
  TabNav,
  Logo,
  UserStatusbar,
  NavMenu,
} from "./components";

import { AuthStoreState } from "./auth/actions";

import { GetMenu } from "./apis";
import { ToApp } from "./components/ToApp";

export interface AppContainerState extends RouterState {
  ready?: boolean;
  navMenu?: any[];
  preparingPage?: boolean;
}

interface AppContainerProps extends RouterHelperProps, AuthStoreState {
  onLoad?: () => void;
}

const pageCache = {};
const pageAuthCache = {};

const setReqUrlByApp = (app) => {
  if (app) {
    $R_P.urlManager.setApp(app);
  }
};

export interface AppLocationState {
  /** 选择的应用 */
  app: string;
  /** 登录的租户 */
  lessee: string;
  /**  */
  pageID: string;
  /** 应用名 */
  appName: string;
}

export type AppLocationType = Location<AppLocationState> &
  DefaultLocationState &
  AppLocationState;

export default class App extends MultipleRouterManager<
  AppContainerProps,
  AppContainerState,
  AppLocationState
> {
  static defaultProps = {
    fromBase64: true,
  };

  state: AppContainerState = defaultRouteState;

  // appLocation!: AppLocationType

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      ready: false,
      showSideMenu: true,
      navMenu: [],
    };
  }

  resolveAppFromUrl = () => {};

  /**
   * 初始化路由配置
   */
  initRouteForApp = (nextState) => {
    const { app: selectedApp, appName } = this.appLocation;
    if (!selectedApp) {
      redirectToRoot();
    } else {
      /** 为 http 请求工具设置 */
      setReqUrlByApp(selectedApp);
      /** 设置默认的 url，让 url 带上 app 表饰 */
      setDefaultParams({
        app: selectedApp,
        appName,
      });
      this.initRoute();
    }

    if (nextState) this.setState(nextState);
  };

  componentDidMount() {
    GetMenu().then((menuData) => {
      // this.setState();

      this.initRouteForApp({
        navMenu: menuData,
        ready: true,
      });
    });
  }

  componentDidCatch(e) {
    // console.log(e);
    const { logging } = this.props;
  }

  handleHistoryChange = (activeRoute) => {
    const { appName: currAppName } = this.appLocation;
    // console.log('object :>> ', activeRoute);
    document.title = currAppName || "自定义工具 3.0";
    // setReqUrlByApp(this.appLocation.state?.app);
    // console.log(this.state.activeRoute);
  };

  getRouteItem = (pathname) => Router[pathname];

  /** 是否进入了应用 */
  isEntryApp = () => this.state.routers.length > 0;

  appContext = {
    history: this.history,
    onNavigate: this.onNavigate,
  };

  renderPages = () => {
    const { routers, routerSnapshot, activeRoute } = this.state;

    return (
      <div className="pages-container">
        {Object.keys(routerSnapshot).map((pagePath, idx) => {
          const pageItemInfo = routerSnapshot[pagePath];
          const pageAuthInfo = pageAuthCache[pagePath];
          const isShow = pagePath === activeRoute;
          const { pathname, pathSnapshot: pageKey } = pageItemInfo;
          const pageDOMID = pathname.replace("/", "");

          /**
           * 从路由配置中找到 pagePath 对应的页面
           */
          const routeConfig = this.getRouteItem(
            resolvePagePathWithSeperator(pagePath)
          );
          const Child = routeConfig?.component;

          return (
            <PageContainer
              pagePath={pagePath}
              pageAuthInfo={pageAuthInfo}
              appContext={this.appContext}
              appLocation={this.appLocation}
              className="page"
              key={pageKey}
              id={pageDOMID}
              style={{
                display: isShow ? "block" : "none",
              }}
              ChildComp={Child}
            ></PageContainer>
          );
        })}
      </div>
    );
  };

  isShowSideMenu = () => {
    // 如果在页面设计器，则不显示左菜单
    const { activeRoute } = this.state;
    const isPageDesigner = activeRoute.indexOf("page-designer") > -1;
    return !isPageDesigner;
  };

  /**
   * 渲染导航栏
   * 策略：
   * 1. 需要进入了应用才显示导航栏
   */
  renderNav = () => {
    const { navMenu, activeRoute } = this.state;
    /**
     * 是否选择了应用，必须选择应用后才现实菜单
     */
    const isShowMainNav = this.isEntryApp();
    return isShowMainNav ? (
      <NavMenu show menuData={navMenu} activeRoute={activeRoute} />
    ) : null;
    // return isShowMainNav ? <Nav navConfig={navMenu} /> : null;
  };

  /**
   * 渲染导航栏
   * 策略：
   * 1. 需要进入了应用才显示导航栏
   */
  renderTopNav = () => {
    const { navMenu, activeRoute } = this.state;
    /**
     * 是否选择了应用，必须选择应用后才现实菜单
     */
    const isShowMainNav = this.isEntryApp();
    return isShowMainNav ? (
      <div className="__top-nav-container">
        {navMenu?.map((item) => {
          const { id, title, path, child, icon } = item;
          // console.log(item);
          let _path = path;
          if (child) _path = child[0].path;
          return (
            <div
              className="top-nav-item"
              key={id}
              onClick={(e) => {
                onNavigate({
                  type: "PUSH",
                  path: _path,
                });
              }}
            >
              <Icon n={icon} className="px-2 text-xl" />
              <span>{title}</span>
            </div>
          );
        })}
      </div>
    ) : (
      <span className="flex"></span>
    );
    // return isShowMainNav ? <Nav navConfig={navMenu} /> : null;
  };

  render() {
    const { logout } = this.props;
    const { routers, routerSnapshot, activeRoute, navMenu, ready } = this.state;
    const { appName: currAppName } = this.appLocation;

    const showSideMenu = this.isShowSideMenu();

    const isEntryApp = this.isEntryApp();

    const appContainerClasses = classnames([
      "bg-gray-100",
      // !showSideMenu && "hide-side-menu",
    ]);

    return (
      <div id="__provider_app_container" className={appContainerClasses}>
        {ready ? (
          <>
            <header
              id="__provider_app_header"
              className={`provider-app-header bg-white flex items-center content-center shadow ${
                isEntryApp ? "has-app" : ""
              }`}
            >
              <Logo
                appName={currAppName}
                isEntryApp={isEntryApp}
                onClick={(e) => {
                  this.closeAll();
                }}
              />
              {this.renderTopNav()}
              {
                // 需要选择应用后才进入应用
                isEntryApp && <ToApp appLocation={this.appLocation} />
              }
              <UserStatusbar logout={logout} />
              <div className="pr-2 text-gray-600">
                <Version />
              </div>
            </header>
            <div id="__provider_app_content">
              {!isEntryApp ? (
                <Dashboard
                  didMount={() => {
                    /** 设置 app 为空，因为还未选择 app */
                    $R_P.urlManager.setApp("");
                  }}
                  appLocation={this.appLocation}
                  onSelectApp={({ app, appName }) => {
                    setReqUrlByApp(app);
                    setDefaultParams({
                      app,
                      appName,
                    });
                  }}
                />
              ) : (
                <>
                  <div id="__provider_side_nav">{this.renderNav()}</div>
                  <div id="__provider_pages_container">
                    <TabNav
                      onClose={(idx) => {
                        this.closeTab(idx);
                      }}
                      routers={routers}
                      routerSnapshot={routerSnapshot}
                      activeRoute={activeRoute}
                      getRouteName={getRouteName}
                    />
                    {this.renderPages()}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <LoadingTip />
        )}
      </div>
    );
  }
}
