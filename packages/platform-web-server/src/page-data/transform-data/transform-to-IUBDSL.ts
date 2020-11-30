import { ProcessCtx, TransfromCtx } from "./types";
import { genTableMetadata, genMetadataPkSchema } from "./metadata-fn";
import { genWidgetFromPageData } from "./widget-fn";
import { genAction } from './task';
import { genSchema } from "./schema";

const mergeMetadata = (ds1: any[], ds2: any[]) => {
  const res: any[] = ds1;
  ds2.forEach(d => {
    const idx = res.findIndex((dd => dd.id === d.id));
    if (idx > -1) {
      /** 取更有效的数据 */
      if (d.tableRefId || d.tableRefId) {
        res.splice(idx, 1, d);
      }
    } else {
      res.push(d);
    }
  });
  return res;
};


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

export const pageData2IUBDSL = async (pageData, processCtx: ProcessCtx) => {

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
      isSearch: false
    },
    tableMetadata: [],
  };
  /** dataSource目前绑定的是选项数据源 */
  const { dataSource, pageInterface, linkpage, schema, actions, varRely } = contentData.meta;
  
  /** 页面widget */
  /** 生成元数据 */
  // const metadata1 = await genTableMetadata(dataSources, processCtx);
  // const tableMetadata: any[] = await genTableMetadata(dataSource, processCtx);
  // const tableMetadata = mergeMetadata(metadata1, metadata2);

  // genMetadataPkSchema(transfromCtx, tableMetadata);
  // transfromCtx.tableMetadata = tableMetadata;
  // console.log(tableMetadata);
  console.log('------------------ table metadata -----------------');
  /** 转换schema */
  const tranSchema = genSchema(schema);
  
  /** 生成widget数据 */
  const widgets = genWidgetFromPageData(transfromCtx, contentData.content);
  console.log(widgets);
  /**  生成动作  */
  const actionCollection = genAction(transfromCtx, actions, { pageSchema: {
    ...tranSchema,
    ...transfromCtx.extralDsl.tempSchema.reduce((res, val) => ({ ...res, [val.schemaId]: val }), {}),
  } }); // 缺少整个页面的数据模型

  /** varRely处理 */

  /** 合成 */
  const { 
    extralDsl: { 
      tempWeight, tempAction, tempBusinessCode, 
      tempFlow, tempOpenPageUrl, tempSchema, 
      isSearch
    } 
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
    tranSchema,
    tempSchema.reduce((res, val) => ({ ...res, [val.schemaId]: val }), {}),
  );
  console.log(actualActions);
  console.log(actualWidget);
  console.log(actualSchema);

  const IUBDSLData = {
    ...genIUBDSLBaseData(pageData, contentData),
    // pageInterface,
    sysRtCxtInterface: {},
    schema: actualSchema,
    interMetaCollection: { 
      // metaList: tableMetadata.reduce((res, val) => ({ ...res, [val.id]: val }), {}), 
      metaList: {}, 
      refRelation: {} 
    },
    relationshipsCollection: {},
    widgetCollection: actualWidget,
    actionsCollection: actualActions,
    flowCollection: actualFlowCollection,
    layoutContent: {},
    // extral Data 临时的
    openPageUrl: tempOpenPageUrl,
    isSearch,
    businessCode: tempBusinessCode.map(v=> `__${pageData.id}${v}`)
  };


  return IUBDSLData;
};

