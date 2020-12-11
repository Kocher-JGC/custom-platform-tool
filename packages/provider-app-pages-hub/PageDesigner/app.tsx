/* eslint-disable no-param-reassign */
import React from "react";
import produce from "immer";
import {
  AppActionsContext,
  ChangeMetadataOptions,
  VEDispatcher,
  VisualEditorState,
} from "@engine/visual-editor/core";
import {
  getPageDetailService,
  updatePageService,
} from "@provider-app/services";
import { LoadingTip } from "@provider-ui/loading-tip";
import Debounce from "@mini-code/base-func/debounce";
import pick from "lodash/pick";
import {
  ChangeEntityState,
  NextEntityState,
  NextEntityStateType,
} from "@engine/visual-editor/data-structure";
import ToolBar from "./components/PDToolbar";
import WidgetPanel from "./components/PDWidgetPanel";
import CanvasStage from "./components/PDCanvasStage";
import { PDPropertiesEditor } from "./components/PDPropertiesEditor";
import {
  wrapPageData,
  takeUsedWidgetIDs,
  genBusinessCode,
  takeDatasourcesForRemote,
  createPlatformCtx,
  PlatformContext,
  genMetaRefID,
  genMetaIDStrategy,
  getVariableData,
} from "./utils";

import "./style";

/** 是否离线模式，用于在家办公调试 */
const offlineMode = false;
// const offlineMode = true;

interface VisualEditorAppProps extends VisualEditorState {
  dispatcher: VEDispatcher;
}

const debounce = new Debounce();

class PageDesignerApp extends React.Component<
  VisualEditorAppProps & HY.ProviderSubAppProps
> {
  componentDidMount = async () => {
    // 在顶层尝试捕获异常
    try {
      this.perpareInitData();
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 更改 page meta 的策略
   * 1. 如果没有传入 metaID，认为是新增行为
   * 2. 如果传入了 metaID，则认为是更新行为
   * 3. 通过 replace 控制是否全量替换更新
   * 4. 通过 relyID 指定该 meta 的被依赖项
   */
  changePageMetaStradegy = (
    options: ChangeMetadataOptions
  ): string | string[] => {
    const {
      selectedInfo,
      dispatcher: { ChangePageMeta },
    } = this.props;
    const { id: activeEntityID } = selectedInfo;

    const isArrayOptions = Array.isArray(options);

    const returnMetaIDs: string[] = [];
    const nextOptions: ChangeMetadataOptions = genMetaIDStrategy(options, {
      entityID: activeEntityID,
      forEachCalllback: (metaID) => returnMetaIDs.push(metaID),
    });

    ChangePageMeta(nextOptions);

    return isArrayOptions ? returnMetaIDs : returnMetaIDs[0];
  };

  /**
   * 获取 meta
   */
  takeMeta = (options) => {
    const { pageMetadata } = this.props;
    const { metaAttr, metaRefID } = options;
    return metaRefID
      ? pageMetadata[metaAttr]?.[metaRefID]
      : pageMetadata[metaAttr];
  };

  changeWidgetType = (widgetType: string) => {
    const {
      dispatcher: { ChangeWidgetType },
      selectedInfo,
    } = this.props;
    const { nestingInfo, entity } = selectedInfo;
    ChangeWidgetType(
      {
        nestingInfo,
        entity,
      },
      widgetType
    );
  };

  /**
   * 响应更新数据源的回调
   * TODO: 优化链路
   */
  onUpdatedDatasource = async (interDatasources: PD.Datasources) => {
    const nextDSState = {};
    interDatasources.forEach((dsItem, idx) => {
      const dsRefID = genMetaRefID("dataSource", {
        idStrategy: dsItem.id,
      });
      nextDSState[dsRefID] = { ...dsItem, dsType: "pageDS" };
    });
    this.changePageMetaStradegy({
      type: "replace",
      metaAttr: "dataSource",
      datas: nextDSState,
    });
  };

  /**
   * 获取数据源
   */
  getDatasources = () => {
    return this.props.appContext.payload?.interDatasources;
  };

  /**
   * 获取远端的页面信息数据
   */
  getCurrPageDataDetail = () => {
    const { appContext } = this.props;
    const { pageDataRes } = appContext?.payload;
    return pageDataRes;
  };

  /**
   * 获取页面信息
   */
  getPageInfo = () => {
    const { flatLayoutItems, pageMetadata } = this.props;
    const pageDataFormRemote = this.getCurrPageDataDetail();
    // const { pageID, title } = appLocation;
    const submitData = pick(pageDataFormRemote, [
      "id",
      "type",
      "moduleID",
      "name",
      "belongMenus",
    ]);
    const usedWidgets = takeUsedWidgetIDs(flatLayoutItems, pageDataFormRemote);
    const businessCodes = genBusinessCode(flatLayoutItems, pageDataFormRemote);
    const dataSources = takeDatasourcesForRemote(pageMetadata.dataSource);
    return {
      ...submitData,
      usedWidgets,
      businessCodes,
      dataSources,
    };
  };

  /**
   * 获取页面内容
   */
  getPageContent = () => {
    const { layoutInfo, pageMetadata, appLocation, appContext } = this.props;
    const { pageState } = appContext;
    const { pageID } = appLocation;
    const pageContent = wrapPageData({
      id: pageID,
      pageID,
      pageState,
      name: "测试页面",
      pageMetadata,
      layoutInfo,
    });

    return pageContent;
  };

  /**
   * 准备应用初始化数据，并发进行
   * 1. 获取前端动态资源：所有组件类数据、属性项数据、组件面板数据、属性面板数据、页面可编辑属性项数据
   * 2. 从远端获取页面数据，包括 页面数据、数据源
   * 3. 将「数据源面板」插入到组件类面板中
   * 4. 将数据准备，调用 InitApp 初始化应用
   */
  perpareInitData = async () => {
    const { dispatcher, appLocation } = this.props;
    const { pageID } = appLocation;
    const { InitApp } = dispatcher;

    /** 并发获取初始化数据 */
    const [pageDataRes] = await Promise.all([
      !offlineMode && getPageDetailService(pageID),
    ]);

    /** 准备初始化数据 */
    const initData = produce<AppActionsContext>({}, (draftInitData) => {
      if (!offlineMode) {
        const { pageContent } = pageDataRes;
        draftInitData.pageContent = pageContent;
        draftInitData.payload = {
          pageDataRes,
        };
        draftInitData.initMeta = {
          // 合并初始化 meta
          varRely: {
            "var.pageInput.0.mode": {
              title: "页面模式",
              type: "pageInput",
              varType: "string",
              realVal: "insert",
              code: "var.page.mode",
            },
          },
        };
      }
      return draftInitData;
    });

    InitApp(initData);
  };

  /**
   * 更新页面状态
   * @param nextPageState
   */
  changePageState = (nextPageState) => {
    const {
      dispatcher: { UpdateAppContext },
    } = this.props;
    UpdateAppContext({
      pageState: nextPageState,
    });
  };

  updatePage = (options = {}) => {
    // const {
    //   datasources = this.getDatasources()
    // } = options;
    return new Promise((resolve, reject) => {
      // const interDatasources = datasources;
      const pageContent = this.getPageContent();
      if (offlineMode) return resolve({});
      updatePageService({
        pageInfoForBN: this.getPageInfo(),
        pageContentForFE: pageContent,
        // extendData: this.wrapDataSourceDataForUpdate(interDatasources),
      })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  /**
   * 发布页面
   */
  onReleasePage = () => {
    return this.updatePage();
  };

  /**
   * 添加控件变量的规则，响应添加
   */
  onAddEntity = (entity) => {
    this.changePageMetaStradegy({
      type: "create",
      metaAttr: "varRely",
      relyID: entity.id,
      data: {
        type: "widget",
        widgetRef: entity.id,
        varAttr: entity.varAttr,
        eventAttr: entity.eventAttr,
      },
    });
  };

  private updateQueue: NextEntityState[] = [];

  pushToUpdateQueue = (nextEntityState: NextEntityStateType) => {
    if (Array.isArray(nextEntityState)) {
      this.updateQueue = [...this.updateQueue, ...nextEntityState];
    } else {
      this.updateQueue.push(nextEntityState);
    }
  };

  consumUpdateQueue = () => {
    const retData = [...this.updateQueue];
    this.updateQueue = [];
    return retData;
  };

  updateEntityState = (nextState) => {
    const {
      dispatcher: { UpdateEntityState },
      selectedInfo,
    } = this.props;
    const { entity, nestingInfo } = selectedInfo;
    UpdateEntityState({ entity, nestingInfo }, nextState);
  };

  getVariableData = (filter, options) => {
    const { pageMetadata, flatLayoutItems } = this.props;
    return getVariableData(
      { pageMetadata, flatLayoutItems },
      { filter, options }
    );
  };

  getPageMeta = (attr) => {
    return attr ? this.props.pageMetadata[attr] : this.props.pageMetadata;
  };

  /**
   * 由页面设计器提供给属性项使用的平台上下文
   */
  platformCtx = createPlatformCtx({
    changePageMeta: this.changePageMetaStradegy,
    genMetaRefID,
    takeMeta: this.takeMeta,
    changeWidgetType: this.changeWidgetType,
    getVariableData: this.getVariableData,
    getPageMeta: this.getPageMeta,
    // changeEntityState: this.changeEntityState,
  });

  render() {
    const {
      dispatcher,
      selectedInfo,
      layoutInfo,
      pageMetadata,
      appContext,
      flatLayoutItems,
      appLocation,
    } = this.props;
    // console.log(pageMetadata);
    // console.log(layoutInfo);

    // 调整整体的数据结构，通过 redux 描述一份完整的{页面数据}
    const { InitEntityState } = dispatcher;
    const { id: activeEntityID, entity: activeEntity } = selectedInfo;

    if (!appContext.ready) {
      return <LoadingTip />;
    }
    return (
      <PlatformContext.Provider value={this.platformCtx}>
        <div className="visual-app bg-white">
          <header className="app-header">
            <ToolBar
              pageMetadata={pageMetadata}
              flatLayoutItems={flatLayoutItems}
              onReleasePage={this.onReleasePage}
              changePageState={this.changePageState}
              appLocation={appLocation}
              pageState={appContext.pageState}
            />
          </header>
          <div
            className="app-content"
            // style={{ top: 0 }}
          >
            <div className="comp-panel">
              <WidgetPanel
                pageMetadata={pageMetadata}
                onUpdatedDatasource={this.onUpdatedDatasource}
              />
            </div>
            <div className="canvas-container" style={{ height: "100%" }}>
              <CanvasStage
                selectedInfo={selectedInfo}
                layoutNodeInfo={layoutInfo}
                pageMetadata={pageMetadata}
                onAddEntity={this.onAddEntity}
                onStageClick={() => {
                  // SelectEntity(PageEntity);
                }}
                {...dispatcher}
              />
            </div>
            <div className="prop-panel">
              {activeEntity && (
                <PDPropertiesEditor
                  key={activeEntityID}
                  pageMetadata={pageMetadata}
                  interDatasources={this.getDatasources()}
                  selectedEntity={activeEntity}
                  entityState={activeEntity?.propState}
                  initEntityState={(entityState) => {
                    // TODO: 属性项更改属性追踪器
                    InitEntityState(selectedInfo, entityState);
                  }}
                  updateEntityState={this.updateEntityState}
                />
              )}
            </div>
          </div>
        </div>
      </PlatformContext.Provider>
    );
  }
}

// const createPageDesignerApp = () => PageDesignerApp

export default PageDesignerApp;
