import { TransfromCtx } from "../types";
import { genWidgetFromPageData } from "./widget-fn";
import { genAction } from './task';
import { genInterMeta } from "./gen-inter-meta";
import { varRely2Schema } from "./varRely-2-schema";
import { event2Flows } from "./events-2-flows";
import { genExtralSchemaOfTablePK } from "./schema";

/**
 * -. 基础数据
 * -. 元数据
 * -. 布局、组件 -->  产生额外的schemas、widget、action、flow
 * -. 动作 -->  产生 flow
 * -. 额外产生的action, 上下的flow关联
 */

const genIUBDSLBaseData = (pageData, contentData) => {

  const { id, name } = pageData;

  return {
    pageID: contentData.id || id || 'testIDs',
    name: contentData.name || name,
    type: 'config'
  };
};

export const pageData2IUBDSL = async (pageData, transfCtx) => {

  const { pageContent, dataSources, businessCodes } = pageData;
  const contentData = JSON.parse(pageContent);
  const transfromCtx: TransfromCtx = {
    extralDsl: { 
      tempAction: [], 
      tempFlow: [], 
      tempBusinessCode: [],
      tempSchema: [],
      tempWeight: [],
      tempOpenPageUrl: '',
      tempRef2Val: [],
      tempAPIReq: [],
      pageFieldsToUse: [],
      pageLifecycle: {},
      isSearch: false
    },
    pkSchemaRef: [],
    interMeta: {
      interMetas: [],
      interRefRelations: []
    },
    schema: {},
    metaSchema: {},
  };
  /** dataSource目前绑定的是选项数据源 */
  const { dataSource, pageInterface, linkpage, schema, actions, varRely, events } = contentData.meta;
  
  /** 页面widget */
  /** 生成元数据 */
  const interMeta = await genInterMeta(dataSource, transfCtx);
  const { interMetas, interRefRelations } = interMeta;
  transfromCtx.interMeta = interMeta;
  // console.log(interMeta);
  console.log('------------------ inter metadata -----------------');
  
  /** 额外逻辑 schema */
  genExtralSchemaOfTablePK(transfromCtx, interMetas);
  
  /** 转换schema */
  // const tranSchema = genSchema(schema);
  const transfSchema = varRely2Schema(varRely);
  transfromCtx.schema = transfSchema;
  transfromCtx.metaSchema = schema;

  /** 生成widget数据 */
  const widgets = genWidgetFromPageData(transfromCtx, contentData.content);
  // console.log(widgets);


  /** varRely处理 */

  /** event处理/action是连着处理的, 有依赖关系 */
  /**  生成动作  */
  const actionCollection = genAction(transfromCtx, actions); // 缺少整个页面的数据模型
  event2Flows(transfromCtx, events);

  /** 合成 */
  const { 
    extralDsl: { 
      tempWeight, tempAction, tempBusinessCode, tempAPIReq,
      tempFlow, tempOpenPageUrl, tempSchema, tempRef2Val,
      pageLifecycle,
      isSearch
    },
    pkSchemaRef
  } = transfromCtx;
  const actualActions = Object.assign({},
    tempAction.reduce((res, val) => ({ ...res, [val.actionId]: val }), {}),
    actionCollection,
  );
  const actualWidget = Object.assign({}, 
    tempWeight.reduce((res, val) => ({ ...res, [val.id]: val }), {}),
    widgets.reduce((res, val) => ({ ...res, [val.widgetId]: val }), {}),
  );
  const actualFlowCollection = tempFlow.reduce((res, val) => ({ ...res, [val.id]: val }), {});
  const actualSchema = Object.assign({},
    transfSchema,
    tempSchema.reduce((res, val) => ({ ...res, [val.schemaId]: val }), {}),
  );
  const actualRef2Val = tempRef2Val.reduce((res, val) => ({ ...res, [val.ref2ValId]: val }), {});
  // console.log(actualActions);
  // console.log(actualWidget);
  // console.log(actualSchema);
  

  const IUBDSLData = {
    ...genIUBDSLBaseData(pageData, contentData),
    // pageInterface,
    sysRtCxtInterface: {},
    schema: actualSchema,
    interMetaCollection: { 
      // metaList: tableMetadata.reduce((res, val) => ({ ...res, [val.id]: val }), {}), 
      metaList: interMetas.reduce((res, val) => ({ ...res, [val.refId]: val }), {}), 
      refRelation: interRefRelations.reduce((res, val) => ({ ...res, [val.refId]: val }), {}), 
    },
    relationshipsCollection: {},
    widgetCollection: actualWidget,
    actionsCollection: actualActions,
    flowCollection: actualFlowCollection,
    layoutContent: {},
    ref2ValCollection: actualRef2Val,
    APIReqCollection: tempAPIReq.reduce((res, val) => ({ ...res, [val.reqId]: val }), {}), 
    // extral Data 临时的
    openPageUrl: tempOpenPageUrl,
    pageLifecycle,
    pkSchemaRef,
    isSearch,
    businessCode: tempBusinessCode.map(v=> `__${pageData.id}${v}`)
  };


  return IUBDSLData;
};

