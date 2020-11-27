/* eslint-disable no-param-reassign */
import React from "react";
import produce from 'immer';
import { AppActionsContext, ChangeMetadataOptions, VEDispatcher, VisualEditorState } from "@engine/visual-editor/core";
import { getPageDetailService, updatePageService } from "@provider-app/services";
import { LoadingTip } from "@provider-ui/loading-tip";
import { nanoid } from 'nanoid';
import pick from "lodash/pick";
import ToolBar from './components/PDToolbar';
import WidgetPanel from './components/PDWidgetPanel';
import CanvasStage from './components/PDCanvasStage';
import PropertiesEditor from './components/PDPropertiesEditor';
import { wrapPageData, takeUsedWidgetIDs, genBusinessCode, takeDatasourcesForRemote, createPlatformCtx, PlatformContext } from "./utils";

import { ChangeEntityState, GenMetaRefID, NextEntityStateType } from "@engine/visual-editor/data-structure";

import './style';
import { entityStateMergeRule } from "@engine/visual-editor/utils";

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
    metaAttr, 
    options
  ) => {
    if (!metaAttr) throw Error('请传入 metaAttr，否则逻辑无法进行');
    const { idStrategy } = options || {};
    const _extraInfo = idStrategy ? Array.isArray(idStrategy) ? idStrategy : [idStrategy] : null;
    const _extraInfoStr = _extraInfo ? _extraInfo.join('.') : '';
    let prefix = '';
    /**
     * meta id 生成策略与规则
     */
    switch (metaAttr) {
      case 'dataSource':
        // return this.genDatasourceMetaID();
        // _extraInfoStr = dsID ? dsID : '';
        // return `ds.${dsID}`;
        prefix = 'ds';
        break;
      case 'schema':
        // _relyWidget = true;
        prefix = 'schema';
        break;
        // return `schema.${_extraInfoStr}`;
      case 'varRely':
        // _relyWidget = true;
        prefix = 'var';
        break;
        // return `var.${_extraInfoStr}`
      case 'actions':
        prefix = 'act';
        break;
        // return `act.${_extraInfoStr}`
      default:
    }
    // return `${prefix}.${_extraInfoStr}`;
    const idArr = [
      prefix,
      _extraInfoStr,
    ].filter(i => !!i);
    return idArr.join('.');
    // return `${prefix}.${activeEntityID}${idStrategy ? `.${idStrategy}` : ''}${nanoID ? `.${nanoID}` : ''}`;
  }

  /**
   * 更改 page meta 的策略
   * 1. 如果没有传入 metaID，认为是新增行为
   * 2. 如果传入了 metaID，则认为是更新行为
   * 3. 通过 replace 控制是否全量替换更新
   * 4. 通过 relyID 指定该 meta 的被依赖项
   */
  changePageMetaStradegy = (options: ChangeMetadataOptions): string | string[] => {
    const { selectedInfo, dispatcher: { ChangePageMeta } } = this.props;
    const { id: activeEntityID } = selectedInfo;

    const isArrayOptions = Array.isArray(options);

    // ts 的 bug，ts 无法通过变量来推断类型是否数据
    const optionsArr = Array.isArray(options) ? options : [options];

    const returnMetaIDs: string[] = [];
    const nextOptions: ChangeMetadataOptions = [];

    optionsArr.forEach((optItem) => {
      const {
        metaAttr,
      } = optItem;

      const nextItem = { ...optItem };

      if(optItem.type === 'create' || optItem.type === 'create/rm') {
        /** 如果是新增 meta */
        const { metaID, data, relyID } = optItem;
        let newMetaID = metaID;
        if(!newMetaID) {
          /** 
           * 如果没有 metaID, 则根据 metaAttr 生成对应的 id 生成策略
           */
          let idStrategy;

          /**
           * 以下为生成对应的 meta 节点数据的 ID 的策略
           */
          switch (metaAttr) {
            case 'dataSource':
              idStrategy = data.id;
              break;
            case 'schema':
              /** 通过绑定 column field code 与组件 id 生成有标志性的 key */
              idStrategy = [data?.column?.fieldCode, activeEntityID];
              break;
            case 'varRely':
              /** 通过绑定外部传入的 rely id 来确认与变量的依赖项的关系 */
              idStrategy = relyID;
              break;
            case 'actions':
              const nanoID = nanoid(8);
              /** 通过生成随机的 id 确保动作的唯一 */
              idStrategy = nanoID;
              break;
            default:
          }

          newMetaID = this.genMetaRefID(metaAttr, { idStrategy });
        }

        returnMetaIDs.push(newMetaID);

        Object.assign(nextItem, {
          metaID: newMetaID,
          relyID
        });
      }

      nextOptions.push(nextItem);
    });

    ChangePageMeta(nextOptions);

    return isArrayOptions ? returnMetaIDs : returnMetaIDs[0];
  }

  /**
   * 获取 meta
   */
  takeMeta = (options) => {
    const { pageMetadata } = this.props;
    const { metaAttr, metaRefID } = options;
    return metaRefID ? pageMetadata[metaAttr]?.[metaRefID] : pageMetadata[metaAttr];
  }

  changeWidgetType = (widgetType: string) => {
    const { dispatcher: { ChangeWidgetType }, selectedInfo } = this.props;
    const { nestingInfo, entity } = selectedInfo;
    ChangeWidgetType({
      nestingInfo,
      entity
    }, widgetType);
  }

  /**
   * 响应更新数据源的回调
   * TODO: 优化链路
   */
  onUpdatedDatasource = async (interDatasources: PD.Datasources) => {
    const nextDSState = {};
    interDatasources.forEach((dsItem, idx) => {
      const dsRefID = this.genMetaRefID('dataSource', {
        idStrategy: dsItem.id
      });
      nextDSState[dsRefID] = dsItem;
    });
    this.changePageMetaStradegy({
      type: 'replace',
      metaAttr: 'dataSource',
      datas: nextDSState,
    });
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
    const initData = produce<AppActionsContext>({}, (draftInitData) => {
      if (!offlineMode) {
        const {
          pageContent
        } = pageDataRes;
        draftInitData.pageContent = pageContent;
        draftInitData.payload = {
          pageDataRes,
        };
        draftInitData.initMeta = {
          // 合并初始化 meta
          varRely: {
            'var.pageInput.0.mode': {
              title: '页面模式',
              type: 'pageInput',
              varType: 'string',
              realVal: 'insert',
              code: 'var.page.mode'
            }
          }
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
   * 添加控件变量的规则，响应添加
   */
  onAddEntity = (entity) => {
    this.changePageMetaStradegy({
      type: 'create',
      metaAttr: 'varRely',
      relyID: entity.id,
      data: {
        type: 'widget',
        widgetRef: entity.id,
        varAttr: entity.varAttr,
        eventAttr: entity.eventAttr
      },
    });
  }

  /**
   * 获取变量数据
   */
  getVariableData = async (filter: string[] = [], options) => {
    const varRely = options ? options.varRely : this.props.pageMetadata.varRely;
    const flatLayoutItems = options ? options.flatLayoutItems : this.props.flatLayoutItems;
    /** 获取自定义变量 */
    const getCustomedVariable = () => {
      return [];
    };
    /** 获取控件变量 */
    const getWidgetVariable = () => {
      const varList = [];
      if(!varRely) return [];
      for(const varID in varRely ){
        if (!Object.prototype.hasOwnProperty.call(varRely, varID)) continue;
        const variableItems = varRely[varID];
        const { type, varAttr, widgetRef } = variableItems;
        /** 只检索控件类型变量 */
        if(type !== 'widget' || !widgetRef) continue;
        /** 获取对应控件数据 */
        const widgetEntity = flatLayoutItems[widgetRef];
        if(!widgetEntity) continue;
        const { propState } = widgetEntity;
        if (!propState) continue;
        // TODO: 这里取了特定的值，后续需要改进
        const { widgetCode, title } = propState;
        /** 控件对应变量 */
        varAttr && varAttr.forEach((varItem) => {
          const { alias, attr, type: varType } = varItem;
          const code = `${widgetCode}.${attr}`;
          varList.push({
            code, varType, type,
            title: `${title}.${alias}`,
            id: code,
          });
        });
      }
      return varList;
    };
    /** 获取页面变量 */
    const getPageVariable = () => {
      return [
        { code: 'var.page.name', title: '页面名称', id: 'var.page.name', varType: 'string', type: 'page' },
        { code: 'var.page.code', title: '页面编码', id: 'var.page.code', varType: 'string', type: 'page' },
      ];
    };
    /** 获取系统变量 */
    const getSystemVaraible = () => {
      return [];
    };
    /** 获取输入参数变量 */
    const getInputVariable = () => {
      if(!varRely) return [
        { title: '页面模式', type: 'pageInput', varType: 'string', realVal: 'insert', code: 'var.page.mode', id: 'var.page.0.mode' }
      ];
      const varList = [];
      for(const id in varRely ){
        if (!Object.prototype.hasOwnProperty.call(varRely, id)) continue;
        const variableItems = varRely[id];
        const { type, alias, varType, code, realVal, title } = variableItems || {};
        if(type !== 'pageInput') continue;
        varList.push({
          code, type, varType, alias, id, realVal, title
        });
      }
      return varList;
    };
    const getVariable = {
      customed: getCustomedVariable,
      system: getSystemVaraible,
      widget: getWidgetVariable,
      page: getPageVariable,
      pageInput: getInputVariable
    };
    const result = {};
    for(const key in getVariable){
      if(filter.includes(key)) continue;
      if(typeof getVariable[key] !== 'function') continue;
      const resultTmpl = await getVariable[key]();
      Object.assign(result, { [key]: resultTmpl });
    }
    return result;    
  }
  /**
   * 更改组件实例状态的统一方法
   * @param nextEntityState 
   */
  changeEntityState: ChangeEntityState = (nextEntityState: NextEntityStateType) => {
    const { dispatcher: { UpdateEntityState }, selectedInfo } = this.props;
    const { entity: activeEntity } = selectedInfo;
    const entityState = entityStateMergeRule(activeEntity?.propState, nextEntityState);
    UpdateEntityState({
      nestingInfo: selectedInfo.nestingInfo,
      entity: activeEntity
    }, entityState);
  }

  /**
   * 由页面设计器提供给属性项使用的平台上下文
   */
  platformCtx = createPlatformCtx({
    changePageMeta: this.changePageMetaStradegy,
    genMetaRefID: this.genMetaRefID,
    takeMeta: this.takeMeta,
    changeWidgetType: this.changeWidgetType,
    getVariableData: this.getVariableData,
    changeEntityState: this.changeEntityState,
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
    const {
      InitEntityState,
    } = dispatcher;
    const { id: activeEntityID, entity: activeEntity } = selectedInfo;

    if (!appContext.ready) {
      return (
        <LoadingTip />
      );
    }
    return (
      <PlatformContext.Provider value={this.platformCtx}>
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
                onAddEntity={this.onAddEntity}
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
                    pageMetadata={pageMetadata}
                    interDatasources={this.getDatasources()}
                    selectedEntity={activeEntity}
                    entityState={activeEntity?.propState}
                    initEntityState={(entityState) => {
                      // TODO: 属性项更改属性追踪器
                      InitEntityState(selectedInfo, entityState);
                    }}
                    changeEntityState={(entityState) => {
                      // TODO: 属性项更改属性追踪器
                      this.changeEntityState(entityState);
                    }}
                  />
                )
              }
            </div>
          </div>
        </div>
      </PlatformContext.Provider>
    );
  }
}

// const createPageDesignerApp = () => PageDesignerApp

export default PageDesignerApp;
