import React from "react";
import { IUBDSLRenderer } from "@iub-dsl/platform/react";
import { PageRenderCtx } from "@engine/ui-admin-template";

import { queryPageData } from "../../services/page";
import "./index.less";

import { APBDSLrequest } from "../../utils";
import { originGenUrl, SYS_MENU_BUSINESSCODE } from "../../utils/gen-url";

export interface PageContainerProps extends PageRenderCtx {
  /** 页面 id */
  pageID: string;
  /** 访问的应用 */
  app: string;
  /** 租户 */
  lessee: string;
  /** token */
  t: string;
  /** 页面的模式 */
  mode?: string;
}

const genPageRenderer = (props, Renderer) => {
  return ({ pageId }) => {
    return <Renderer {...props} pageID={pageId} />;
  };
};

/**
 * 页面加载容器，主要功能：
 * 1. 根据登录用户是否有权限访问该页面来判断是否显示页面
 * 2. 提供页面内的 UI 是否可以显示的授权功能
 * TODO: 完善功能
 */
export class PageContainer extends React.PureComponent<PageContainerProps> {
  static PageRenderer: any = () => "错误的PageRenderer渲染";
  static requestHandler: any = (...args) => false;
  state = {
    pageData: {},
    ready: false,
    requestHandler: () => {},
  };

  componentDidMount() {
    const { pageID, app, lessee, mode, t } = this.props;
    PageContainer.requestHandler = async (
      reqParam,
      bizCode = SYS_MENU_BUSINESSCODE
    ) => {
      return await APBDSLrequest(
        originGenUrl({ lesseeCode: lessee, bizCode, appCode: app }),
        reqParam
      );
    };
    PageContainer.PageRenderer = genPageRenderer(this.props, PageContainer);
    queryPageData({
      id: pageID,
      app,
      lessee,
      mode,
      t,
    }).then((pageData) => {
      this.setState({
        pageData,
        ready: true,
      });
    });
  }

  render() {
    const { children, pageID } = this.props;
    const { ready, pageData } = this.state;
    // console.log('-------------PageContainer Render--------------');
    return (
      <div
        className="__page_container"
        style={{
          minHeight: 400,
        }}
      >
        {/* <IUBDSLRenderer dsl={locationForm} key={pageID} /> */}
        {ready ? (
          <IUBDSLRenderer
            PageRenderer={PageContainer.PageRenderer}
            requestHandler={PageContainer.requestHandler}
            dsl={pageData}
          />
        ) : (
          <div>Loading</div>
        )}
      </div>
    );
  }
}
