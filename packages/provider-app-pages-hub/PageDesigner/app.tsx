/* eslint-disable no-param-reassign */
import React from "react";
import produce from 'immer';
import { ChangeMetadataAction, VEDispatcher, VisualEditorState } from "@engine/visual-editor/core";
import { getPageDetailService, updatePageService } from "@provider-app/services";
import { LoadingTip } from "@provider-ui/loading-tip";
import { nanoid } from 'nanoid';
import pick from "lodash/pick";
import ToolBar from './components/PDToolbar';
import WidgetPanel from './components/PDWidgetPanel';
import CanvasStage from './components/PDCanvasStage';
import PropertiesEditor from './components/PDPropertiesEditor';
import { wrapPageData, takeUsedWidgetIDs, genBusinessCode, takeDatasourcesForRemote } from "./utils";
// import {
//   getPageContentWithDatasource,
// } from "./services";
import { PDUICtx } from './utils';

import './style';
// import { takeDatasources, wrapInterDatasource } from "./services/datasource";
import { GenMetaRefID } from "@engine/visual-editor/data-structure";
// import { VisualEditorStore } from "@engine/visual-editor/core/store";
/** 是否离线模式，用于在家办公调试 */
const offlineMode = false;
// const offlineMode = true;

interface VisualEditorAppProps extends VisualEditorState {
  dispatcher: VEDispatcher
}

class PageDesignerApp extends React.Component<VisualEditorAppProps & HY.ProviderSubAppProps> {
  componentDidMount = async () => {
    // 在顶层尝试捕获异常
    try {
      this.perpareInitData();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 生成 meta 引用 ID，规则
   * 1. [metaAttr].[widgetEntityID].[nanoID]
   */

  genMetaRefID: GenMetaRefID = (
    metaAttr: ChangeMetadataAction['metaAttr'], 
    options
  ) => {
    if (!metaAttr) throw Error('请传入 metaAttr，否则逻辑无法进行');
    const { id: activeEntityID } = this.props.selectedInfo;
    const { len = 8, extraInfo } = options || {};
    const metaID = nanoid(len);
    let prefix = '';
    /**
     * meta id 生成策略与规则
     */
    switch (metaAttr) {
      case 'dataSource':
        return this.genDatasourceMetaID();
      case 'schema':
        prefix = 'schema';
        break;
      case 'varRely':
        prefix = 'var';
        break;
      case 'actions':
        prefix = 'act';
        break;
      default:
    }
    return `${prefix}.${activeEntityID}${extraInfo ? `.${extraInfo}` : ''}.${metaID}`;
  }

  genDatasourceMetaID = (idx?: number) => {
    const { pageMetadata } = this.props;
    const dsLen = pageMetadata.dataSource ? Object.keys(pageMetadata.dataSource).length : 0;
    const idxPref = idx === 0 ? 0 : idx || dsLen + 1;
    const metaID = nanoid(8);
    return `${idxPref}.ds.${metaID}`;
  }

  /**
   * 获取 meta
   */
  takeMeta = (options) => {
    const { pageMetadata } = this.props;
    const { metaAttr, metaRefID } = options;
    return metaRefID ? pageMetadata[metaAttr]?.[metaRefID] : pageMetadata[metaAttr];
  }

  /**
   * 响应更新数据源的回调
   * TODO: 优化链路
   */
  onUpdatedDatasource = async (interDatasources: PD.Datasources) => {
    const { appContext, dispatcher, appLocation } = this.props;
    // const { pageID, title } = appLocation;
    const { UpdateAppContext, ChangeMetadata } = dispatcher;
    // const pageContent = this.getPageContent();
    // ChangeMetadata({
    //   metaAttr: 'dataSource',

    // })

    // await this.updatePage({
    //   datasources: datasourceFormRemote
    // });
    // const {
    //   interDatasources
    // } = await getPageContentWithDatasource(pageID);
    // const interDatasources = wrapInterDatasource(datasourceFormRemote);
    // console.log(interDatasources);
    const nextDSState = {};
    interDatasources.forEach((dsItem, idx) => {
      nextDSState[this.genDatasourceMetaID(idx)] = dsItem;
    });
    ChangeMetadata({
      metaAttr: 'dataSource',
      data: nextDSState,
      replace: true
    });
    // UpdateAppContext({
    //   payload: {
    //     interDatasources
    //   }
    // });
  }

  /**
   * 获取数据源
   */
  getDatasources = () => {
    return this.props.appContext.payload?.interDatasources;
  }

  /**
   * 获取远端的页面信息数据
   */
  getCurrPageDataDetail = () => {
    const {
      appContext
    } = this.props;
    const { pageDataRes } = appContext?.payload;
    return pageDataRes;
  }

  /**
   * 获取页面信息
   */
  getPageInfo = () => {
    const {
      flatLayoutItems, pageMetadata
    } = this.props;
    const pageDataFormRemote = this.getCurrPageDataDetail();
    // const { pageID, title } = appLocation;
    const submitData = pick(pageDataFormRemote, [
      'id', 'type', 'moduleID', 'name', 'belongMenus',
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
  }

  /**
   * 获取页面内容
   */
  getPageContent = () => {
    const {
      layoutInfo,
      pageMetadata,
      appLocation,
    } = this.props;
    const { pageID } = appLocation;
    const pageContent = wrapPageData({
      id: pageID,
      pageID,
      name: '测试页面',
      pageMetadata,
      layoutInfo,
    });

    return pageContent;
  }

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
      !offlineMode && getPageDetailService(pageID)
    ]);

    /** 准备初始化数据 */
    const initData = produce({}, (draftInitData) => {
      if (!offlineMode) {
        const {
          pageContent
        } = pageDataRes;
        draftInitData.pageContent = pageContent;
        draftInitData.payload = {
          pageDataRes,
        };
      }
      return draftInitData;
    });

    InitApp(initData);
  }

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
      }).then((res) => {
        resolve(res);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  /**
   * 发布页面
   */
  onReleasePage = () => {
    return this.updatePage();
  }

  /**
   * 由页面设计器提供给属性项使用的 UI 上下文
   */
  UICtx = PDUICtx

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
    // console.log(appLocation);
    // console.log(props);
    // 调整整体的数据结构，通过 redux 描述一份完整的{页面数据}
    const {
      InitApp, UnmountApp, UpdateAppContext,
      SelectEntity, InitEntityState, UpdateEntityState,
      SetLayoutInfo, DelEntity, AddEntity, ChangeMetadata
    } = dispatcher;
    const { id: activeEntityID, entity: activeEntity } = selectedInfo;

    if (!appContext.ready) {
      return (
        <LoadingTip />
      );
    }

    return (
      <div className="visual-app bg-white">
        <header className="app-header">
          <ToolBar
            pageMetadata={pageMetadata}
            flatLayoutItems={flatLayoutItems}
            onReleasePage={this.onReleasePage}
            appLocation={appLocation}
          />
        </header>
        <div
          className="app-content"
          // style={{ top: 0 }}
        >
          <div
            className="comp-panel"
          >
            <WidgetPanel
              pageMetadata={pageMetadata}
              onUpdatedDatasource={this.onUpdatedDatasource}
            />
          </div>
          <div
            className="canvas-container"
            style={{ height: '100%' }}
          >
            <CanvasStage
              selectedInfo={selectedInfo}
              layoutNodeInfo={layoutInfo}
              pageMetadata={pageMetadata}
              onStageClick={() => {
                // SelectEntity(PageEntity);
              }}
              {...dispatcher}
            />
          </div>
          <div
            className="prop-panel"
          >
            {
              activeEntity && (
                <PropertiesEditor
                  key={activeEntityID}
                  UICtx={this.UICtx}
                  genMetaRefID={this.genMetaRefID}
                  takeMeta={this.takeMeta}
                  pageMetadata={pageMetadata}
                  changeMetadata={ChangeMetadata}
                  interDatasources={this.getDatasources()}
                  selectedEntity={activeEntity}
                  defaultEntityState={activeEntity.propState}
                  initEntityState={(entityState) => InitEntityState(selectedInfo, entityState)}
                  updateEntityState={(entityState) => {
                    UpdateEntityState({
                      nestingInfo: selectedInfo.nestingInfo,
                      entity: activeEntity
                    }, entityState);
                  }}
                />
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

// const createPageDesignerApp = () => PageDesignerApp

export default PageDesignerApp;
