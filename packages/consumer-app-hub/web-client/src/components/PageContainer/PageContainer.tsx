import React, { useEffect, useState, useMemo, useRef } from "react";
import { IUBDSLRenderer } from "@iub-dsl/platform/react";
import { PageRenderCtx } from "@engine/ui-admin-template";

import { queryPageData } from "../../services/page";
import "./index.less";
// import D from '@iub-dsl/demo/pd/1';

// interface IContainerProps {}

const getPageData = ({ pageId, mode, lessee, app }) => async () => {
  if (pageId) {
    // TODO 模式，租户，app 参数来源
    return queryPageData({
      id: pageId,
      mode,
      lessee,
      app
    });
  }
  return Promise.resolve({});
};

export interface PageContainerProps extends PageRenderCtx {
  /** 页面 id */
  pageId: string
  /** 访问的应用 */
  app: string
  /** 租户 */
  lessee: string
  /** token */
  t: string
  /** 页面的模式 */
  mode?: string
}


/**
 * 页面加载容器，主要功能：
 * 1. 根据登录用户是否有权限访问该页面来判断是否显示页面
 * 2. 提供页面内的 UI 是否可以显示的授权功能
 * TODO: 完善功能
 */
export class PageContainer extends React.Component<PageContainerProps> {
  state = {
    pageData: {},
    ready: false
  }

  componentDidMount() {
    const { pageId, app, lessee, mode, t } = this.props;
    queryPageData({
      id: pageId,
      app,
      lessee,
      mode,
      t
    })
      .then((pageData) => {
        this.setState({
          pageData,
          ready: true
        });
      });
  }

  render() {
    const { children } = this.props;
    const { ready, pageData } = this.state;
    
    return (
      <div
        className="__page_container" style={{
          minHeight: 400
        }}
      >
        {
          ready ? (
            <IUBDSLRenderer dsl={pageData} />
          ) : (
            <div>
              Loading
            </div>
          )
        }
      </div>
    );
  }
}
