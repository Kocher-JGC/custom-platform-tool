import React from 'react';

import Mousetrap from 'mousetrap';
import { VersionDisplayer, VersionChecker, VersionCheckerProps } from 'version-helper';
import { MultipleRouterManager, OnNavigate, RouterHelperProps, RouterState } from 'multiple-page-routing';

import { Color } from '@deer-ui/core/utils/props';
import { $T } from '@deer-ui/core/utils/config';
import {
  ShowModal, Tabs, Tab, Menus,
  Loading, setUILang, Icon, setLangTranslate
} from '../ui-refs';

import { showShortcut, ShortcutDesc, NavMenu, ThemeSelector, TabForNavBar } from '../components';
import {
  // Notfound, 
  DashboardLoader, FooterLoader, StatusbarLoader, StatusbarLoaderProps, StatusbarRenderCtx
} from '../plugins/loader';
import {
  getThemeConfig, setTheme, setLayout, setDarkMode
} from '../components/theme-selector';
import { AdminTmplMenuItem } from '../types';


export interface PageRenderCtx {
  $T: (t: string) => string
  isActive: boolean
  pageRoute: string
  onNavigate: OnNavigate
  history
}

export type PluginRenderer<C> = (ctx: C) => JSX.Element

export interface AdminLayoutProps extends RouterHelperProps {
  /** 菜单数据 */
  menuData: AdminTmplMenuItem[]
  /** 渲染每个页面的渲染器 */
  pageRender: (renderCtx: PageRenderCtx) => JSX.Element
  /** 版本号文件的路径 */
  getVersionUrl?: string
  /** 国际化文件存放目录的路径 */
  i18nMapperUrl?: string
  /** 插件渲染集合 */
  pluginRenderer?: {
    /** 顶部状态栏插件 */
    Statusbar?: PluginRenderer<StatusbarRenderCtx>
    /** Dashboard 插件 */
    Dashboard?: PluginRenderer<{}>
    /** 404 页面插件 */
    NotfoundPage?: PluginRenderer<{}>
    /** Footer 插件 */
    Footer?: PluginRenderer<{}>
  }
  /** 默认主题 */
  defaultTheme?: Color
  /** 默认布局方式 */
  defaultLayout?: 'vertical' | 'horizontal'
  /** 是否黑夜模式 */
  defaultDarkMode?: boolean
  /** 默认的语言 */
  defaultLang?: Navigator['language']
  // iframeMode?: boolean,
  /** 国际化配置 */
  i18nConfig?: {
    [lang: string]: string
  }
  /** 最大存在的 tab 路由 */
  maxRouters?: number
  /** 顶级 tab 是否在 statusbar 中 */
  tabInStatusbar?: boolean
  /** 背景 */
  bgStyle?: React.CSSProperties
  appTitle?: StatusbarLoaderProps['appTitle']
  /** 给 statusbar 的更多操作选项 */
  statusbarActions?: StatusbarLoaderProps['statusbarActions']
  versionInfo?: VersionCheckerProps['versionInfo']
}

interface AdminLayoutState extends RouterState {
  /** 用于搜索菜单的页面导航 + 页面名称 mapper */
  menuCodeMapper: {
    [pagePath: string]: string
  }
  /** 应用的布局 */
  layout: string
  /** 应用的主题 */
  theme: string
  /** 应用的语言 */
  lang: Navigator['language']
  /** 是否展示菜单 */
  showNavMenu: boolean
  /** 是否黑夜模式 */
  darkMode: boolean
  /** 应用是否已经准备完成 */
  ready: boolean
}

/**
 * 语言配置，格式为：
 * @example
 * LANG_MAPPER = {
 *   'zh-CN': {
 *     'app': '应用'
 *   }
 * }
 */
const LANG_MAPPER = {};

export class AdminTemplateEngine extends MultipleRouterManager<AdminLayoutProps, AdminLayoutState> {
  static setI18nUrl = (nextUrl) => {
    // i18nMapperUrl = nextUrl;
    console.warn('该接口已废弃，请通过传入 i18nMapperUrl 的 prop 指定');
  }

  static defaultProps = {
    bgStyle: {},
    maxRouters: 10,
    defaultTheme: 'blue',
    defaultLayout: 'horizontal',
    // getVersionUrl: './js/version.json',
    // i18nMapperUrl: './i18n/',
    defaultDarkMode: false,
    statusbarActions: [],
    tabInStatusbar: true,
    cacheState: true,
  }

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      ...this.initThemeConfig(),
      menuCodeMapper: {},
      showNavMenu: true,
      lang: props.defaultLang || navigator.language,
      ready: false,
    };
    this.initApp();
  }

  /**
   * 初始化主题配置
   */
  initThemeConfig = () => {
    // const THEME = Storage.getItem()
    const themeConfig = getThemeConfig();
    return Object.assign({}, {
      theme: this.props.defaultTheme,
      darkMode: this.props.defaultDarkMode,
      layout: this.props.defaultLayout,
    }, themeConfig);
  }

  /**
   * 获取国际化配置文件
   * @param lang 
   */
  geti18nUrl = (lang) => {
    const { i18nMapperUrl } = this.props;
    if (!i18nMapperUrl) return null;
    return `${i18nMapperUrl + lang}.json`;
  }

  /**
   * 从远端获取语言配置
   * @param lang 
   */
  fetchLangMapper = async (lang) => {
    const url = this.geti18nUrl(lang);
    if (!url) return null;
    try {
      const mapper = await (await fetch(url)).json();
      if (!LANG_MAPPER[lang]) LANG_MAPPER[lang] = {};
      Object.assign(LANG_MAPPER[lang], mapper);
      return mapper;
    } catch (e) {
      console.log(e);
      return {};
    }
    // setState && this.setState({
    //   LANG_MAPPER: mapper
    // });
    // 设置 UI 库的 columns
  }

  /**
   * 启动应用运行容器
   */
  initApp = async () => {
    const { lang } = this.state;
    await this.fetchLangMapper(lang);
    this._setUILang(lang);
    this.setState({
      ready: true
    });
  }

  /**
   * 更改应用运行容器的语言
   * @param lang 
   */
  changeLang = async (lang) => {
    if (!lang) return;
    await this.fetchLangMapper(lang);
    this._setUILang(lang);
    this.setState({
      lang,
    });
  }

  /**
   * 设置 UI 库的语言
   * @param lang 
   */
  private _setUILang = (lang) => {
    setLangTranslate(LANG_MAPPER);
    setUILang(lang);
  }

  /**
   * 修改主题颜色
   * @param nextTheme 
   */
  changeTheme = (nextTheme) => {
    this.setState({
      theme: nextTheme,
    });
    setTheme(nextTheme);
  }

  /**
   * 更改为 dark 模式
   * @param nextDarkMode 
   */
  changeDarkMode = (nextDarkMode) => {
    this.setState({
      darkMode: nextDarkMode,
    });
    setDarkMode(nextDarkMode);
  }

  /**
   * 更改布局，未完成
   */
  changeLayout = (nextLayout) => {
    this.setState({
      layout: nextLayout,
    });
    setLayout(nextLayout);
  }

  /**
   * 广播 UI 的 resize 事件
   */
  triggerResize = () => {
    setTimeout(() => {
      const evt = window.document.createEvent('UIEvents');
      evt.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(evt);
    }, 50);
  }

  componentDidMount() {
    Mousetrap.bind(['alt alt'], (e) => {
      this.toggleNavMenu(!this.state.showNavMenu);
      return false;
    });
    Mousetrap.bind(['alt+k'], (e) => showShortcut());
    Mousetrap.bind(['alt+w'], (e) => this.handleCloseFormShortcut());
    this.initRoute();
  }

  componentWillUnmount() {
    Mousetrap.unbind(['alt+k', 'alt alt', 'alt+w']);
    this.unlisten();
  }

  /**
   * 处理来自快捷键的关闭页面
   */
  handleCloseFormShortcut = () => {
    const { activeRouteIdx } = this.state;
    this.closeTab(activeRouteIdx);
  }

  /**
   * 菜单组件处理好数据后的后处理，用于设置 menuCodeMapper，menuCodeMapper 用于菜单搜索
   * @param menuCodeMapper 
   */
  private onGetMenuCodeMapper = (menuCodeMapper) => {
    this.setState({
      menuCodeMapper
    });
    window.__MenuCodeMapper = menuCodeMapper;
  }

  /**
   * 菜单的收起/展开开关
   * @param nextShow 
   */
  toggleNavMenu = (nextShow) => {
    this.setState(({
      showNavMenu
    }) => {
      const _nextShow = typeof nextShow == 'undefined' ? !showNavMenu : nextShow;
      return {
        showNavMenu: _nextShow
      };
    });
    this.triggerResize();
  }

  /**
   * 包装应用传入每个页面实例的上下文
   * @param isActive 
   * @param pageRoute 
   */
  getAppCtx(isActive, pageRoute): PageRenderCtx {
    return {
      $T,
      isActive,
      pageRoute,
      onNavigate: this.onNavigate,
      history: this.history,
    };
  }

  /**
   * 获取系统信息的操作
   */
  getSystemInfoActions = () => {
    return {
      icon: "ellipsis-v",
      overlay: () => {
        return this.renderSystemSetting();
      }
    };
  }

  /**
   * 合并状态栏的默认操作配置，最终数据给到系统设置中
   */
  combindStatusbarDefaultActions = () => {
    const { statusbarActions = [], i18nConfig } = this.props;
    return [
      ...statusbarActions,
      ...(i18nConfig ? [this.getI18nConfig()] : []),
      this.getSystemInfoActions()
    ];
  }

  /**
   * 获取国际化配置
   */
  getI18nConfig = () => {
    const { i18nConfig } = this.props;
    const { lang } = this.state;
    return {
      title: "",
      icon: "globe",
      overlay: ({ hide }) => {
        return i18nConfig ? (
          <Menus
            data={
              Object.keys(i18nConfig).map((langVal) => {
                return {
                  text: langVal,
                  isActive: lang === langVal,
                  action: () => {
                    hide();
                    this.changeLang(langVal);
                  }
                };
              })
            }
          />
        ) : <span></span>;
      }
    };
  }

  /**
   * 渲染系统设置
   */
  renderSystemSetting = () => {
    const { versionInfo, pluginRenderer } = this.props;
    const { theme, darkMode, layout } = this.state;
    const { Footer } = pluginRenderer || {};
    return (
      <div className="__system_setting">
        <ThemeSelector
          onChangeDarkMode={this.changeDarkMode}
          onChangeTheme={this.changeTheme}
          // onChangeLayout={this.changeLayout}
          // layout={layout}
          darkMode={darkMode}
          activeTheme={theme}
        />
        <hr />
        <ShortcutDesc />
        <hr />
        <FooterLoader plugin={Footer}>
          {
            versionInfo ? (
              <VersionDisplayer $T={$T} versionInfo={versionInfo} />
            ) : null
          }
        </FooterLoader>
      </div>
    );
  }

  render() {
    const {
      pluginRenderer = {},
      versionInfo,
      getVersionUrl,
      bgStyle,
      tabInStatusbar,
      menuData,
      pageRender,
      appTitle
    } = this.props;
    const {
      menuCodeMapper,
      showNavMenu,
      activeRoute,
      activeRouteIdx,
      routerSnapshot,
      ready,
      layout,
      theme,
      routers,
      darkMode,
    } = this.state;
    const {
      NotfoundPage, Dashboard, Statusbar
    } = pluginRenderer;
    const routersLen = routers.length;
    const hasRouter = routersLen > 0;
    const statusbarActions = this.combindStatusbarDefaultActions();

    return (
      <div
        id="AdminTemplateEngine"
        className={`__admin_template_layout_main_container ${theme} ${layout} ${darkMode ? 'dark' : 'light'}`}
      >
        {
          ready ? (
            <div className="__main_wrapper">
              <StatusbarLoader
                appTitle={appTitle}
                showNavMenu={showNavMenu}
                menuCodeMapper={menuCodeMapper}
                StatusbarPlugin={Statusbar}
                onToggleNav={this.toggleNavMenu}
                statusbarActions={statusbarActions}
              />
              <div className="__content">
                <NavMenu
                  onDidMount={this.onGetMenuCodeMapper}
                  menuData={menuData}
                  activeRoute={activeRoute}
                  defaultFlowMode={false}
                  show={showNavMenu}
                />
                <div
                  className={
                    `__pages_container ${showNavMenu ? 'show-menu' : 'hide-menu'}`
                  }
                >
                  <TabForNavBar
                    changeRoute={this.changeRoute}
                    closeTab={this.closeTab}
                    closeAll={this.closeAll}
                    menuCodeMapper={menuCodeMapper}
                    hasRouter={hasRouter}
                    routerSnapshot={routerSnapshot}
                    routers={routers}
                    activeRouteIdx={activeRouteIdx}
                    routersLen={routersLen}
                    defaultTitle={(e) => $T('仪表盘')}
                  />
                  <Tabs
                    withContent
                    onlyContent={tabInStatusbar}
                    closeable={hasRouter}
                    closeTip={`${$T('快捷键')}: alt + w`}
                    className="top-tab-wrapper tabs-container"
                    activeTabIdx={hasRouter ? activeRouteIdx : 0}
                    onClose={(idx) => this.closeTab(idx)}
                  >
                    {
                      hasRouter ? routers.map((route, idx) => {
                        // const C = pageComponents[route];
                        const currInfo = routerSnapshot[route];
                        const { params } = currInfo;
                        const key = route + JSON.stringify(params);
                        const isActive = activeRouteIdx === idx;
                        return (
                          <Tab
                            contentClass={route}
                            label={$T(menuCodeMapper[route] || route)}
                            key={key}
                            onChange={(e) => this.changeRoute(route, params)}
                          >
                            {
                              pageRender?.(this.getAppCtx(isActive, route))
                            }
                            {/* {
                              C ? (
                                <C {...this.getAppCtx(isActive, route)}/>
                              ) : NotfoundPage ? this.loadPlugin(NotfoundPage) : (
                                <Notfound key={`${route}404`}/>
                              )
                            } */}
                          </Tab>
                        );
                      }) : (
                        <Tab
                          contentClass="dashboard"
                          label={$T('仪表盘')}
                          key="dashboard"
                        >
                          <DashboardLoader
                            CustomerComponent={Dashboard}
                            {...this.getAppCtx(true, 'dashboard')}
                          />
                        </Tab>
                      )
                    }
                  </Tabs>
                </div>
              </div>
            </div>
          ) : <Loading loading></Loading>
        }
        <div
          className="fill fixbg main-bg-color" style={{
            ...bgStyle,
            zIndex: -1
          }}
        />
        {
          getVersionUrl && <VersionChecker getVersionUrl={getVersionUrl} versionInfo={versionInfo} />
        }
      </div>
    );
  }
}
