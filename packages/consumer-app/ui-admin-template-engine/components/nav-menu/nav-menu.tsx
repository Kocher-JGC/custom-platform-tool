import React, { Component } from "react";

import { DebounceClass, Call } from "@mini-code/base-func";
import { $T } from "@deer-ui/core/utils";
import store from "store";

import { Link, LinkProps } from "multiple-page-routing";
import { ToolTip, Icon, PureIcon } from "../../ui-refs";

import { AdminTmplMenus, AdminTmplMenuItem } from "../../types";

const delayExec = new DebounceClass();

const MENU_ACTIVE_STORAGE = "MENU_ACTIVE_STORAGE";

function getScreenHeight() {
  return document.documentElement.clientHeight;
}

function getElementLeft(element) {
  if (!element) return null;
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft + current.clientLeft;
    current = current.offsetParent;
  }
  return actualLeft;
}

function getElementTop(element) {
  if (!element) return null;
  let actualTop = element.offsetTop;
  let current = element.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop + current.clientTop;
    current = current.offsetParent;
  }
  return actualTop;
}

const iconComFilter = ({ icon, pureIcon }, props, other?) => {
  if (!icon && !pureIcon) return other;
  const I = pureIcon ? PureIcon : Icon;
  return <I {...props} n={pureIcon || icon} />;
};

const MENU_CODE_MAPPER = "MENU_CODE_MAPPER";

const menuCodeMapper = store.get(MENU_CODE_MAPPER) || {};

const MenuItem = (props) => {
  const { icon = "bars", pureIcon, title } = props;
  return (
    <div className="layout a-i-c">
      {iconComFilter({ icon, pureIcon }, { classNames: ["menu-icon"] })}
      <span>{$T(title)}</span>
      <span className="flex" />
      <Icon n="angle-right" classNames={["direct"]} />
    </div>
  );
};

export interface NavMenuProps {
  activeRoute: string;
  menuData: AdminTmplMenus;
  onDidMount?: (menuCodeMapper) => void;
  /** 菜单的字段映射 */
  // menuMappers?: {
  //   child: string
  //   code: string
  //   title: string
  //   icon?: string
  //   pureIcon?: string
  // }
  /* 是否悬浮模式的菜单模式 */
  flowMode?: boolean;
  defaultFlowMode?: boolean;
  show?: boolean;
  onClickMenu?: () => void;
}

export interface NavMenuState {
  showMenuMapper: Record<string, string>;
  flowMenuConfig: {
    activeItem: Record<string, AdminTmplMenuItem>;
    activeIdx: any;
    isShow: boolean;
    offset: {
      top: number;
      left: number;
      height: number;
    };
  };
  flowMode: boolean;
}

/**
 * 左菜单控件
 * 1. 支持无限嵌套结构
 * 2. 支持“树”模式
 * 3. 支持“悬浮”模式
 */
export class NavMenu extends Component<NavMenuProps, NavMenuState> {
  // static defaultProps = {
  //   menuMappers: {
  //     child: 'child',
  //     code: 'code',
  //     title: 'title',
  //     path: 'path',
  //     icon: 'icon',
  //     pureIcon: 'pureIcon',
  //   },
  // }

  flowModeKey = "IS_FLOW_MODA";

  flowMenuContainer;

  navMenuDOM;

  constructor(props) {
    super(props);
    const showMenuMapper = store.get(MENU_ACTIVE_STORAGE) || {};
    const storageMode = store.get(this.flowModeKey);
    const { defaultFlowMode = false, menuData } = props;

    window.MENU_DATA = menuData;

    this.state = {
      showMenuMapper,
      flowMenuConfig: {
        activeItem: {},
        activeIdx: "",
        isShow: false,
        offset: {
          top: 0,
          left: 0,
          height: 0,
        },
      },
      flowMode: storageMode ? !!+storageMode : defaultFlowMode,
    };
  }

  componentDidMount() {
    Call(this.props.onDidMount, menuCodeMapper);
  }

  getNormalMenuChildren = (initDataList: AdminTmplMenus) => {
    if (!initDataList || !Array.isArray(initDataList)) return null;
    const { onClickMenu } = this.props;
    const { showMenuMapper, flowMode } = this.state;
    let allSet: any[] = [];
    let foldIdx = 0;
    const recursive = (dataList: AdminTmplMenus) => {
      const currDOMSets: any[] = [];
      dataList.forEach((item, currItemIdx) => {
        if (!item) return;
        // const _item = this.menuItemFilter(item);
        const { child, title, path } = item;
        const key = path + title;
        const to = this.wrapLink(path);

        const hasChildren = child && child.length > 0;
        const isFold = hasChildren;

        const currFoldIdx = foldIdx;

        ++foldIdx;
        const isActive = showMenuMapper.hasOwnProperty(currFoldIdx);
        let dom;
        if (isFold) {
          let childDOM;
          if (child) {
            childDOM = recursive.call(this, child);
          }
          dom = (
            <div
              key={foldIdx}
              className={`fold fold-${currFoldIdx}${
                flowMode ? "" : isActive ? " active" : " hide-fold"
              }`}
            >
              <div
                className="fold-title"
                onClick={(e) => {
                  e.stopPropagation();
                  !flowMode && this.toggleFold(currFoldIdx);
                }}
              >
                <MenuItem {...item} />
              </div>
              <div className="children">{childDOM}</div>
            </div>
          );
        } else {
          dom = this.getMenuLinkerDOM({
            ...item,
            key,
            to,
            onClick: onClickMenu,
            title,
          });
        }
        currDOMSets.push(dom);
      });
      return currDOMSets;
    };
    allSet = recursive.call(this, initDataList);
    return allSet;
  };

  hideFlowMenu = () => {
    delayExec.exec(() => {
      this.setFlowMenu({
        isShow: false,
      });
    }, 200);
  };

  getMenuLinkerDOM = (
    options: LinkProps & AdminTmplMenuItem & { key: string }
  ) => {
    const { activeRoute } = this.props;
    const { code, key, to, onClick, title, icon, pureIcon, params } = options;
    menuCodeMapper[to] = title;
    store.set(MENU_CODE_MAPPER, menuCodeMapper);
    const _menuText = $T(title);
    const isActive = activeRoute === to;

    return (
      <Link
        key={key}
        isActive={isActive}
        className="menu"
        to={to}
        params={params}
        onClick={() => Call(onClick, key, code)}
      >
        {iconComFilter({ icon, pureIcon }, { classNames: ["menu-icon"] }, null)}
        {_menuText}
      </Link>
    );
  };

  getFlowModeDOM = (initDataList: AdminTmplMenus) => {
    const { flowMenuConfig } = this.state;
    const { onClickMenu } = this.props;
    const { offset, activeItem = {}, activeIdx, isShow } = flowMenuConfig;

    const flowMenuDOM = (
      <div
        className={`flow-menu-container${isShow ? " show" : ""}`}
        onMouseEnter={() => delayExec.cancel()}
        onMouseLeave={() => this.hideFlowMenu()}
        style={{
          left: offset.left,
        }}
        ref={(flowMenuContainer) => {
          if (flowMenuContainer) {
            this.flowMenuContainer = flowMenuContainer;

            const flowContainerHeight = flowMenuContainer.offsetHeight;
            const flowContainerScrollTop = this.navMenuDOM
              ? this.navMenuDOM.scrollTop
              : 0;
            const expectedOffsetTop = offset.top - flowContainerScrollTop;
            const parentHeight = offset.height;
            const offsetBottom = expectedOffsetTop + flowContainerHeight;

            const overBottom = getScreenHeight() - offsetBottom;
            let finalOffsetTop = expectedOffsetTop;
            const flowMenuOffsetTopPx =
              parentHeight === flowContainerHeight ? 0 : parentHeight;

            if (overBottom < 0) {
              /**
               * 如果高度超过了底部
               */
              finalOffsetTop = expectedOffsetTop + overBottom;
            }
            flowMenuContainer.style.top = `${
              finalOffsetTop - flowMenuOffsetTopPx
            }px`;
          }
        }}
      >
        {this.getNormalMenuChildren(activeItem.child)}
      </div>
    );

    const allSet = initDataList.map((item, idx) => {
      if (!item) return null;
      // const _item = this.menuItemFilter(item);
      const { child, title, path } = item;
      const to = this.wrapLink(path);
      const isFold = child && child.length > 0;
      const key = path + title;
      const isHovering = activeIdx === idx;
      return isFold ? (
        <div
          key={idx}
          onMouseEnter={(e) => {
            delayExec.cancel();
            const { target } = e;
            if (e.currentTarget !== target) return;
            this.setFlowMenu({
              targetElem: target,
              activeItem: item,
              idx,
            });
          }}
          onMouseLeave={() => {
            this.hideFlowMenu();
          }}
          className={`fold${isHovering ? " hover" : ""}`}
        >
          <MenuItem {...item} />
        </div>
      ) : (
        this.getMenuLinkerDOM({
          ...item,
          key,
          to,
          onClick: onClickMenu,
          title,
        })
      );
    });

    return (
      <div className="nav-menu-tree">
        {allSet}
        {flowMenuDOM}
      </div>
    );
  };

  // menuItemFilter = (item): AdminTmplMenuItem => {
  //   const { menuMappers } = this.props;
  //   const {
  //     child, code, title, icon = '', path
  //   } = menuMappers;
  //   return {
  //     ...item,
  //     child: item[child],
  //     code: item[code],
  //     path: item[path],
  //     title: item[title],
  //     icon: item[icon],
  //   };
  // }

  showSearch = () => {};

  wrapLink = (path: string) => {
    return `/${path}`.replace(/\/+/, "/");
  };

  changeMenuUIMode = (isFlowMode: boolean) => {
    this.setState({
      flowMode: isFlowMode,
    });
    store.set(this.flowModeKey, isFlowMode ? "1" : "0");
  };

  toggleFold = (idx: number, isShow?: boolean) => {
    const { showMenuMapper } = this.state;
    const nextState = Object.assign({}, showMenuMapper);

    if (typeof isShow !== "undefined") {
      isShow ? (nextState[idx] = true) : delete nextState[idx];
    } else if (nextState.hasOwnProperty(idx)) {
      delete nextState[idx];
    } else {
      nextState[idx] = true;
    }

    store.set(MENU_ACTIVE_STORAGE, nextState);
    this.setState({
      showMenuMapper: nextState,
    });
  };

  setFlowMenu = (options) => {
    const { flowMenuConfig } = this.state;
    const { targetElem, activeItem, isShow = true, idx } = options;
    let nextOffset = flowMenuConfig.offset;

    if (targetElem) {
      const { offsetWidth, offsetHeight } = targetElem;
      nextOffset = {
        top: getElementTop(targetElem),
        left: getElementLeft(targetElem) + offsetWidth,
        height: offsetHeight,
      };
    }
    this.setState({
      flowMenuConfig: {
        offset: nextOffset,
        activeIdx: idx,
        activeItem,
        isShow,
      },
    });
  };

  render() {
    const { menuData, show } = this.props;

    const { flowMode } = this.state;

    const menuTree = flowMode ? (
      this.getFlowModeDOM(menuData)
    ) : (
      <div className="nav-menu-tree">
        {this.getNormalMenuChildren(menuData)}
      </div>
    );

    const renderRes = (
      <div
        className={`__admin_nav_menu_container ${show ? "show" : "collapse"}`}
      >
        <div
          ref={(navMenuDOM) => {
            if (navMenuDOM) this.navMenuDOM = navMenuDOM;
          }}
          className={`nav-menu-response ${
            flowMode ? "flow-mode " : "tree-mode "
          }`}
        >
          {menuTree}
        </div>
      </div>
    );

    return renderRes;
  }
}
