import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { omit } from 'lodash';
import { PreviewAppService } from 'src/preview-app/preview-app.service';
import config from '../../config';

const { mockToken } = config;


const genUrl = (params: {lessee: string, app: string }) => {
  return `${config.platformApiUrl}/${params.lessee}/${params.app}`;
};

const flatLayoutNode = (layoutNode, parentID?) => {
  console.log(parentID);
  const componentsCollection = {};
  const layoutContentBody = [];

  layoutNode.forEach((nodeItem) => {
    // const nodeItemI = produce(nodeItem, draft => draft);
    const { id, body } = nodeItem;
    Object.assign(nodeItem, {
      type: 'componentRef',
      // compType: nodeItem?.widgetDef.type,
      compType: nodeItem.widgetRef,
      // widgetRef: {
      // ...nodeItem.widgetRef,
      ...nodeItem.propState
      // }
    });

    // 删除内部字段
    nodeItem = omit(nodeItem, [
      '_state',
      'propState',
      'widgetRef',
    ]);
    // 删除内部字段
    // Reflect.deleteProperty(nodeItem, '_metaID');
    // Reflect.deleteProperty(nodeItem, '_state');
    // Reflect.deleteProperty(nodeItem, 'propState');
    // Reflect.deleteProperty(nodeItem, 'widgetRef');

    componentsCollection[id] = Object.assign({}, nodeItem,
      parentID && {
        parentID
      });
    nodeItem.componentID = id;
    nodeItem.refID = id;
    layoutContentBody.push(nodeItem);

    if(body) {
      flatLayoutNode(body, id);
    }
  });
  return { componentsCollection, layoutContentBody };
};

const pickObjFromKeyArr = (obj, keyArr: string[]) => {
  return keyArr.reduce((res, key) => {
    res[key] = obj[key];
    return res;
  }, {});
};

const updateStateAction = (widgetId: string, schemas) => ({
  actionId: widgetId,
  actionName: 'updateState',
  actionType: 'updateState',
  actionOptions: {
    changeTarget: schemas
  },
  actionOutput: 'undefined'
});

const DEFALUT_FLOW_MARK = 'f_';

const genDefalutFlow = (id: string, out = []) => ({
  id: `${DEFALUT_FLOW_MARK}${id}`,
  actionId: `@(actions).${id}`,
  flowOutCondition: [],
  flowOut: [out]
});

const genFormInputDefaltAction = (widgetId: string) => ({
  onChange: {
    type: 'actionRef',
    actionID: `@(flow).${DEFALUT_FLOW_MARK}${widgetId}`
  }
});
const genFormButtonDefaltAction = (widgetId: string) => ({
  onClick: {
    type: 'actionRef',
    actionID: `@(flow).${DEFALUT_FLOW_MARK}${widgetId}`
  }
});

@Injectable()
export class PageDataService {

  constructor(
    private readonly previewAppService: PreviewAppService
  ) {}

  tempAction: any[] = [];

  tempFlow: any[] = [];

  tempSchema: any[] = [];

  tempWeight: any[] = [];

  tempOpenPageUrl: string;

  isSearch = false;

  tempBusinessCode: string[] = [];

  mockDataSource =   {
    id: '1320563055356157952',
    version: null,
    createdBy: '1295915065878388737',
    modifiedBy: '1295915065878388737',
    gmtCreate: 1603681741000,
    gmtModified: 1603681741000,
    deleteFlag: null,
    pageInfoId: '1320554143869444096',
    pageCurrentVersion: '13',
    datasourceId: '1320554257547665408',
    datasourceName: null,
    datasourceType: 'TABLE'
  }

  mockColumn =  {
    id: 'schema_ZhqCfeGB',
    column: {
      id: '1320554987868266502',
      name: '用户',
      colDataType: 'NORMAL',
      fieldSize: 32,
      fieldType: 'STRING',
      fieldCode: 'username'
    },
    tableInfo: { id: '1320554257547665408', name: '用户表单', type: 'TABLE' }
  }

  genMetadataFromOnceTable(schema: any, onceTableInfo) {

    const columns = {};
    const schemaIds = Object.keys(schema);
    const { datasourceId, code } = onceTableInfo;
    if (!datasourceId) return {};
    const result = {
      id: datasourceId,
      code,
      name: '',
      type: 'general',
      moduleId: '', // 关联表Id
      columns
    };
    schemaIds.forEach((schemaId) =>{
      const schemaInfo = schema[schemaId];
      const { column, tableInfo } = schemaInfo;
      const { id: tableId, name: tableName } = tableInfo;
      const {
        id: columnId,
        name, colDataType,
        fieldSize, fieldType, fieldCode,
      } = column;
      if (tableId === datasourceId) {
        result.name = tableName;
        columns[columnId] = {
          id: columnId,
          name,
          /** 数据类型 */
          colDataType,
          /** 字段 size */
          fieldSize,
          /** 字段类型 */
          fieldType,
          /** 字段的名字 */
          fieldCode,
          type: 'string',
        };
      }
    });
    return result;
  }

  genMetadataFromTableInfo(tableInfos: any[]) {
    return tableInfos?.map((inff) => {
      if (!inff) return false;
      const { columns: oldColumns, tableInfo } = inff;
      if (tableInfo && oldColumns) {
        const columns = oldColumns.map((info) => {
          return {
            id: info.id,
            name: info.name,
            fieldCode: info.code,
            fieldType: info.fieldType,
            fieldSize: info.fieldSize,
            dataType: info.dataType,
            colDataType: info.dataType,
            type: 'string',
          };
        }).reduce((res, val) => ({ ...res, [val.id]: val }), {});
        return {
          ...tableInfo,
          type: 'general',
          moduleId: '', // 关联表Id
          columns
        };
      }
      return false;
    }).filter(v => v) || [];
  }

  transfromSchema(schema: any) {
    const schemaRes = {};
    const schemaIds = Object.keys(schema);
    schemaIds.forEach((schemaId) =>{
      const schemaInfo = schema[schemaId];
      const { column, tableInfo } = schemaInfo;
      const { id: tableId, name: tableName } = tableInfo;
      const {
        id: columnId, isPk, defaultVal
      } = column;
      schemaRes[schemaId] = {
        type: 'string',
        fieldMapping: `@(metadata).${tableId}.${columnId}`,
        defaultVal,
        isPk
      };
    });
    return schemaRes;
  }

  genFormInput(widgetData) {
    const { compType, field, id, title, defValue, type } = widgetData;
    /** 更改状态的动作 */
    this.tempAction.push(updateStateAction(id, `@(schemas).${field}`));
    /** 更改状态的流程项 */
    this.tempFlow.push(genDefalutFlow(id));
    return {
      id, compType, label: title, title, value: `@(schemas).${field}`,
      defValue, type, compCode: id,
      actions: {
        ...genFormInputDefaltAction(id)
      }
      // unit, placeholder, tipContent
    };
  }

  genFromButton(widgetData) {
    const { compType, field, id, title, type, actionRef } = widgetData;
    this.tempBusinessCode.push(`__${id}`);
    return {
      id, compType: 'NormalButton', title, label: title, text: title, type,
      actions: {
        // ...genFormButtonDefaltAction('middle_1234')
        ...genFormButtonDefaltAction(actionRef)

      }
    };
  }

  genCond(exp1, exp2) {
    return {
      conditionControl: { and: ["0_0"] },
      conditionList: { "0_0": { operator: "equ", exp1, exp2 } }
    };
  }

  /** 收集整个页面的 */
  getDataCollectionFromSchema(schema) {
    const collectStruct = [];
    const schemaIds = Object.keys(schema);
    console.log(schema);
    let condition;

    schemaIds.forEach(id => {
      if (schema[id].isPk) {
        condition = this.genCond(schema[id].fieldMapping, `@(schemas).${ schema[id].schemaId}`);
      }
      collectStruct.push({
        field: `${schema[id].fieldMapping}`,
        collectField: `@(schemas).${id}`,
      });
    });
    return { collectStruct, condition };
  }

  genAPBCreataAction() {

  }

  genAPBDSLAction(actionId: string, actionConf, pageSchema) {
    const {
      action:{
        actionName,  actionType, forEntrieTable, targetTable
      },
      // condition, event, preTrigger, triggerAction
    } = actionConf;

    const { collectStruct, condition } = this.getDataCollectionFromSchema(pageSchema) || { collectStruct: [], condition: { conditionControl: {}, conditionList: {} } };

    const actionList: any = {};
    const actionIds: string[] = [];

    ['TableInsert', 'TableUpdate'].forEach(t => {
      const ac = {
        actionId: `${actionId}_${t}`,
        actionName,
        actionType: 'APBDSLCURD',
        actionOptions: {
          businesscode: '34562',
          actionList: {
            apbId1: {
              type: t,
              table: `@(metadata).${targetTable}`,
              fieldMapping: {
                collectionType: 'structObject',
                struct: collectStruct
              },
              condition: { conditionControl: {}, conditionList: {} }
            }
          },
          actionStep: ['apbId1']
        },
        actionOutput: 'undefined'
      };

      if (t === 'TableUpdate') {
        ac.actionOptions.actionList.apbId1.condition = condition;
      }
      actionIds.push(ac.actionId);
      actionList[ac.actionId] = ac;
    });

    actionList[`${actionId}_TableDel`] =  {
      actionId: `${actionId}_TableDel`,
      actionName: "删除",
      actionType: "APBDSLCURD",
      actionOptions: {
        businesscode: "34562",
        actionList: {
          apbId1: {
            type: "TableDelete",
            table: `@(metadata).${targetTable}`,
            condition
          }
        },
        actionStep: ["apbId1"]
      },
      actionOutput: "undefined"
    };

    actionIds.push(`${actionId}_TableDel`);
    actionIds.forEach(id => {
      const data = genDefalutFlow(id);
      this.tempFlow.push(data);
    });
    this.tempFlow.push({
      id: `f_${actionId}`,
      actionId: "",
      flowOutCondition: [
        { condition: {}, when: [''] },
        { condition: {}, when: ['updateStatus'] },
        { condition: {}, when: ['deleteStatus'] },
      ],
      flowOut: [
        ...actionIds.map(i => ([`${DEFALUT_FLOW_MARK}${i}`]))
      ]
    });

    return actionList;
  }

  genOpenPageAction(actionId: string, actionConf) {
    const { triggerAction, event, action: { pageID } } = actionConf;
    this.tempOpenPageUrl = pageID;
    return {
      actionId,
      actionName: `openModal_${actionId}`,
      actionType: 'openModal',
      actionOptions: {
        type: 'iub-dsl',
        pageUrl: pageID,
        triggerAction,
        event
      },
      actionOutput: 'undefined'
    };
  }

  transfromAction(actions, { pageSchema }) {
    let res = {};
    const actionIds = Object.keys(actions);
    actionIds.forEach(id => {
      const action = actions[id][0];
      if (action) {
        const { triggerAction, event, action: { pageID } } = action;
        if (triggerAction === 'submit' && event === 'onClick') {
          res = {
            ...res,
            ...this.genAPBDSLAction(id, action, pageSchema)
          };
        }
        if (triggerAction === 'openPage' && pageID) {
          res[id] = this.genOpenPageAction(id, action);
          this.tempFlow.push(genDefalutFlow(id));
        }
      } else {
        console.error('获取action失败');
      }
    });

    return res;
  }

  transformWidgerData(widgetData, extralData) {
    const result = [];
    const widgetIds = Object.keys(widgetData);

    /** 傻做法 */
    let hasTable = false;
    let tableIdx = -1;
    const tableD = [];

    widgetIds.forEach((id) => {
      const onceWidgetData = widgetData[id];
      const { compType } = onceWidgetData;
      switch (compType) {
        case 'FormInput':
          result.push(
            this.genFormInput(onceWidgetData)
          );
          break;
        case 'FormButton':
          result.push(
            this.genFromButton(onceWidgetData),
          );
          break;
        case 'NormalTable':
          hasTable = true;
          tableIdx = result.push(
            this.genTable(onceWidgetData)
          );
          tableIdx--;
          tableD.push(result[tableIdx]);
          break;
        default:
          result.push(
            onceWidgetData
          );
          break;
      }
    });
    const extralSchema = this.genExtralSchema(extralData?.tableMetaData, hasTable);
    console.log(hasTable, extralSchema);

    if (hasTable && extralSchema) {
      this.genTableExtralData(tableD[0], extralSchema);
      this.addSearchWieght(extralSchema);
      this.addSearchBuntton(extralSchema);
      this.isSearch = true;
    }

    return result.reduce((res, val, i) => {
      res[val.id] = val;
      if (tableIdx - 1 === i) {
        res = {
          ...res,
          ...this.tempWeight.reduce((r, v) => ({ ...r, [v.id]: v }), {}),
        };
      }
      return res;
    }, {});
  }

  addSearchWieght(extralSchema) {
    const { columns, id } = extralSchema;
    const widget = {
      type: 'componentRef',
      compType: 'FormInput',
      id: '',
      field: '',
      title: '',
      defValue: null,
    };
    Object.keys(columns).forEach(key => {
      const info = columns[key];
      if (info.isPk) return;
      widget.id = info.schemaId;
      widget.field = info.schemaId;
      widget.title = info.name;
      this.tempWeight.push(
        this.genFormInput(widget)
      );
    });
  }

  addSearchBuntton(extralSchema) {
    const { columns, id } = extralSchema;
    const weightId = `button_${id}`;
    this.tempWeight.push({
      id: weightId,
      compType: 'NormalButton',
      title: '查询', label: '查询', text: '查询',
      type: 'componentRef',
      actions: {
        ...genFormButtonDefaltAction(weightId)
      }
    });
    const conditionList = {};
    const conditionControl = [];
    Object.keys(columns).forEach((key, i) => {
      const info = columns[key];
      if (info.isPk) return;
      conditionList[`${key}_${i}`] = {
        operator: 'like',
        exp1: `@(metadata).${id}.${info.schemaId}`,
        exp2: `@(schemas).${info.schemaId}`,
      };
      conditionControl.push(`${key}_${i}`);
    });
    const updId = `${weightId}_U`;
    this.tempAction.push(
      {
        actionId: weightId,
        actionName: `${weightId}TableSelect`,
        actionType: 'APBDSLCURD',
        actionOptions: {
          businesscode: '34562',
          actionList: {
            apbA1: {
              type: 'TableSelect',
              table: `@(metadata).${id}`,
              condition: {
                conditionControl: {
                  and: conditionControl
                },
                conditionList
              },
            }
          },
          actionStep: ['apbA1']
        },
        actionOutput: 'string', // TODO
      },
      updateStateAction(updId, `@(schemas).${id}`)
    );
    this.tempFlow.push(
      genDefalutFlow(weightId, [DEFALUT_FLOW_MARK+updId]),
      genDefalutFlow(updId),
    );
  }

  genTableExtralData(tableData, data) {
    const { columns, id } = data;
    tableData.columns = Object.keys(columns).filter(key => !columns[key].isPk).map(key => ({
      dataIndex: columns[key].fieldCode,
      key: columns[key].schemaId,
      title: columns[key].name,
    }));
    tableData.dataSource = `@(schemas).${id}`;
  }

  genTable(widgetData) {
    const { compType, id, label, type } = widgetData;
    return {
      id, label, type, compType,
      columns: [],
      dataSource: '',
    };
  }

  genExtralSchema(tableMetadata, isAll = false) {
    if (tableMetadata && Reflect.has(tableMetadata, 'id') && Reflect.has(tableMetadata, 'columns')) {
      const { columns, id } = tableMetadata;
      const coulumsIds = Object.keys(columns);
      const cc = coulumsIds?.map((coulumsId) => {
        const info = columns[coulumsId];
        if (info.dataType === 'PK') {
          return {
            schemaId: info.id,
            name: info.name,
            type: 'string',
            fieldMapping: `@(metadata).${id}.${info.id}`,
            isPk: true,
            fieldCode: info.fieldCode,
            defaultVal: '$ID()'
          };
        }
        if (isAll) {
          return {
            name: info.name,
            schemaId: info.id,
            type: 'string',
            fieldCode: info.fieldCode,
            fieldMapping: `@(metadata).${id}.${info.id}`,
          };
        }
        return null;
      }).filter(v => v);
      if (isAll) {
        const structArr = {
          schemaId: id,
          collectionType: 'structArray',
          struct: cc
        };
        this.tempSchema.push(structArr);
      }
      this.tempSchema.push(...cc);
      return { columns: cc, id };
    }
    return null;
  }

  async getTableMetadata(dataSource: any, processCtx) {

    if (Array.isArray(dataSource)) {
      const r = dataSource.map((info) => {
        return this.getTableInfoFromRemote({ tableId: info.datasourceId, tableRefId: info.id, tableType: info.datasourceType }, processCtx);
      });
      return Promise.all(r);
    } 
    // if (typeof dataSource === 'object') {
      
    //   const tableRefIdx = Object.keys(dataSource);
    //   const r = tableRefIdx.map(tableRefId => {
    //     const info = dataSource[tableRefId];
  
    //     return this.getTableInfoFromRemote({ tableId: info.tableInfo.id, tableRefId, tableType: info.type }, processCtx);
    //   });
    //   return Promise.all(r);
    // }
    return [];
  }

  /**
   * 页面数据转 IUB-DSL 数据
   * @param pageData
   */
  async pageData2IUBDSL(pageData, extralData: any = {}) {
    console.log(pageData, extralData);

    const { pageContent } = pageData;
    const { tableMetaData } = extralData;
    let contentData;
    // console.dir(pageData);
    const IUBDSLData = {
      sysRtCxtInterface: {},
      schemas: {},
      metadataCollection: [],
      relationshipsCollection: {},
      componentsCollection: {},
      actionsCollection: {},
      flowCollection: {},
      layoutContent: {},
      pageID: '',
      name: '',
      type: '',
      openPageUrl: '',
      isSearch: false,
      businessCode: []
    };
    try {
      contentData = JSON.parse(pageContent);
      console.dir(contentData);
      
      const { content: pageLayoutContent, meta: { schema, actions, dataSource } } = contentData;

      const { componentsCollection, layoutContentBody } = flatLayoutNode(pageLayoutContent);

      /** 生成元数据 */
      // const tableMetaData = await this.getTableMetadata(dataSource, extralData);

      const actualMetadata = Array.isArray(tableMetaData) && this.genMetadataFromTableInfo(tableMetaData) || [];
      // console.log('--------------- actualMetadata ---------------');
      // console.log(actualMetadata);
      
      // eslint-disable-next-line prefer-destructuring
      // extralData.tableMetaData = actualMetadata[0];
      /** 转换组件集合 */
      const actualComponentsCollection = this.transformWidgerData(componentsCollection, extralData);

      /** 转换schemas */
      const actualSchema = Object.assign({},
        this.tempSchema.reduce((res, val) => ({ ...res, [val.schemaId]: val }), {}),
        this.transfromSchema(schema),
      );


      /** 转换动作 */
      const actualActions = Object.assign({},
        this.tempAction.reduce((res, val) => ({ ...res, [val.actionId]: val }), {}),
        this.transfromAction(actions, { pageSchema: actualSchema })
      );
      /** 转换流程 */
      const actualFlowCollection = this.tempFlow.reduce((res, val) => ({ ...res, [val.id]: val }), {});


      IUBDSLData.layoutContent = {
        type: 'general',
        content: layoutContentBody
      };
      IUBDSLData.pageID = contentData.id || 'testIDs';
      IUBDSLData.name = contentData.name;
      IUBDSLData.type = 'config';
      IUBDSLData.componentsCollection = actualComponentsCollection;
      IUBDSLData.metadataCollection = tableMetaData;
      IUBDSLData.schemas = actualSchema;
      IUBDSLData.actionsCollection = actualActions;
      IUBDSLData.flowCollection = actualFlowCollection;
      IUBDSLData.openPageUrl = this.tempOpenPageUrl;
      IUBDSLData.isSearch = this.isSearch;
      IUBDSLData.businessCode = this.tempBusinessCode.map(v=> `__${IUBDSLData.pageID}${v}`);

      this.tempFlow.length = 0;
      this.tempAction.length = 0;
      this.tempSchema.length = 0;
      this.tempWeight.length = 0;
      this.tempBusinessCode.length = 0;
      this.isSearch = false;
    } catch(e) {
      console.log(e);
      contentData = pageContent;
    }
    return IUBDSLData;
  }

  async getTableInfoFromRemote({ tableId, tableRefId, tableType }, { token, lessee, app }) {
    const reqUrl = `${genUrl({ lessee, app })}/data/v1/tables/${tableId}`;
    const resData = await axios
      .get(reqUrl, {
        headers: {
          Authorization: token
        }
      });
    const data = resData?.data?.result;
    console.log('------------ Table Data -----------');
    console.log(data);
    if (data) {
      const tableInfo = {
        id: data.id,
        name: data.name,
        code: data.code,
        tableRefId,
        tableType
      };
      /**
        create_user_id    '随便填个数字'
        last_update_user_id    '随便填个数字'
        sequence    '随便填个数字'
        last_update_time    '随便填个年月日'
        create_time    '随便填个年月日'
        data_version    '随便填个字符串'
        last_update_user_name '非必填'
        create_user_name '非必填'
      */
      const filterSysFiledKeys = ['create_user_id', 'last_update_time', 'last_update_user_id', 'sequence', 'create_time', 'data_version', 'last_update_user_name', 'create_user_name'];
  
      return {
        tableInfo,
        columns: data.columns?.filter(info => !filterSysFiledKeys.includes(info.code))
      };
    } 
    return {
      tableId, tableRefId, tableType,
      reqUrl,
      resData
    };
    

  }

  /** 获取表格组件的cloumn */
  tableInfoToSchema(columns: any[], tableInfo, isAll = false) {
    const res = {};

    const columnKey = ['id', 'name', 'colDataType', 'fieldSize', 'fieldType', 'fieldCode'];
    columns.forEach((info) => {
      if (info.dataType === 'PK') {
        res[info.id] = {
          column: {
            ...pickObjFromKeyArr(info, columnKey),
            fieldCode: info.code,
            isPk: true,
            defaultVal: '$ID()'
          },
          tableInfo
        };
      } else if (isAll) {
        res[info.id] = {
          column: {
            ...pickObjFromKeyArr(info, columnKey),
            fieldCode: info.code,
          },
          tableInfo
        };
      }
    });
    return res;
  }

  /**
   * 从远端获取页面数据
   */
  async getPageDataFromRemote({
    lessee,
    app,
    token = mockToken,
    id
  }): Promise<any> {
    console.log('token', token);
    // const token = this.previewAppService.getToken(lessee);
    const reqUrl = `${genUrl({ lessee, app })}/page/v1/pages/${id}`;
    console.log('reqUrl', reqUrl);
    const processCtx = {
      token, lessee, app
    };
    try {
      const resData = await axios
        .get(reqUrl, {
          headers: {
            Authorization: token
          }
        });
      const data = resData?.data?.result;
      if(!data) {
        console.error('页面输出存在问题?', data);
        throw Error(resData?.data?.msg);
      } else {
        let tableMetaData = null;
        console.log('resDataMsg', resData?.data);
        if (data) {
          const { dataSources, pageContent } = data;
          const content = JSON.parse(pageContent);
          console.log(content.meta.dataSource);
          tableMetaData = await this.getTableMetadata(dataSources, processCtx);
        }
  
        return this.pageData2IUBDSL(data, tableMetaData);
      }
    } catch(e) {
      console.error('error', e);
      throw Error(e);
      // return e;
    }
  }
}
// `http://192.168.14.140:6090/paas/hy/app/page/v1/pages/1308242886768336896`
