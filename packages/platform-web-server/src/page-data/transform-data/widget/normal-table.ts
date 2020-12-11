import { interMetaMark, schemaMark, REQ_MARK, ACT_MARK, apiReqMark } from '../IUBDSL-mark';
import { TransfromCtx, InterRefRelation, FieldDataType } from "../../types";
import { omitObj } from "../utils";
import { FuncCodeOfAPB } from "../task/action-types-of-IUB";
import { genDefalutFlow } from '../task';
import { flowEventHandlerTemplate } from './default-gen';

const omitColKey = ['colDataType', 'fieldSize', 'fieldType'];

const genTableColumns = (columns: any[], tableId) => {
  return columns.map((item) => {
    const { id, dataIndex } = item;
    // const dIdx = `${tableId}_${id}`;

    return {
      ...omitObj(item, omitColKey),
      fieldId: id,
      tableId,
      // dataIndex: dIdx,
    };
  });
};


export interface ReadBaseInfo {
  table: string;
  /** 字段映射信息 */
  fields?: {
    field: string | CountFn;
    alias: string;
  }[];
  condition?: string;
  sort?: { [str: string]: 'desc' | 'asc'; };
  group?: {
    havingCondition: string;
    groupBy: string[];
  },
  page?: {
    from: number;
    size: number;
  };
  needTotal?: boolean;
}

const enum JoinsType{
  leftJoin = 'leftJoin',
  rightJoin = 'rightJoin',
  innerJoin = 'innerJoin',
  crossJoin = 'crossJoin',
} 

/** 统计函数 */
const enum CountFn {
  count = 'count()',
  sum = 'sum()',
  avg = 'avg()',
  max = 'max()',
  min = 'min()',
}
const findRefRelation = (interRefRelations: InterRefRelation[], { tableIds, refType, fields }) => {
  /** 过滤type的函数 */
  const refTypeFilter = refType ? (type) => type === refType : (type) => true;
  /** 以后再合成把 */
  const validTable = Array.isArray(tableIds)
    ? ((interIds: string[]) => (rR: InterRefRelation) => interIds.includes(rR.interId))(tableIds)
    : () => false;
  const validFields = Array.isArray(fields) 
    ? ((fieldsId: string[]) => (rR: InterRefRelation) => fieldsId.includes(rR.fieldId))(fields) /** TODO: 这里无法确保为fieldsId */
    : () => false;
  const refRelationArr = interRefRelations.filter((rR: InterRefRelation) => (validTable(rR) || validFields(rR)) && refTypeFilter(refType));

  return refRelationArr;
};

interface SchemaItemDef {
  type: string; // schemaType
  desc: string; // rely.title  obj.alias
  schemaRef: string; // actualKey, rely.varAttr[0].attr
  schemaType: string; // rely.type[pageInput]
  defaultVal?: string;
  code: string; // rely.code obj.attr // 页面设计器的code「预留」
  fieldRef: string; // @(interMeta).fieldId
  struct: any;
}

const genFoundationSchema = (colInfo, mainInterId) => {
  const { title: desc, dataIndex, fieldCode, fieldId, tableId } = colInfo;
  return {
    schemaId: fieldId,
    type: 'string',
    desc, schemaType: 'TableDataSource',
    schemaRef: `${schemaMark + mainInterId}[#(0|*)]/${fieldId}`,
    fieldRef: `${interMetaMark + tableId}/${fieldId}`
  };
};

const genObjSchema = (colInfo, mainInterId, refRel: InterRefRelation) => {
  const { refFieldId, refFieldCode, refInterCode, refInterId, refShowFieldCode, refShowFieldId } = refRel;
  const { id: colId, title: desc, dataIndex, fieldCode, fieldId, tableId } = colInfo;
  const baseSchemaRef = `${schemaMark + mainInterId}[#(0|*)]/${fieldId}`;
  let struct;
  /** TODO: 会不会重复? */
  if (refFieldId === refShowFieldId) {
    struct = {
      [refFieldId]: {
        schemaId: refFieldId,
        type: 'string',
        desc: '引用与实际同值', schemaType: 'TableDataSource',
        code: `${refInterCode}/${refFieldCode}`,
        schemaRef: `${baseSchemaRef}/${refFieldId}`,
        fieldRef: `${interMetaMark + refInterId}/${refFieldId}`
      },
    };
  } else {
    struct = {
      [refFieldId]: {
        schemaId: refFieldId,
        type: 'string',
        desc: '引用实际值', schemaType: 'TableDataSource',
        code: `${refInterCode}/${refFieldCode}`,
        schemaRef: `${baseSchemaRef}/${refFieldId}`,
        fieldRef: `${interMetaMark + refInterId}/${refFieldId}`
      },
      [refShowFieldId]: {
        schemaId: refShowFieldId,
        type: 'string',
        desc: '引用显示值', schemaType: 'TableDataSource',
        code: `${refInterCode}/${refShowFieldCode}`,
        schemaRef: `${baseSchemaRef}/${refShowFieldId}`,
        fieldRef: `${interMetaMark + refInterId}/${refShowFieldId}`
      }
    };
  }
   
  return {
    schemaId: fieldId,
    type: 'structObject',
    desc, schemaType: 'TableDataSource',
    schemaRef: baseSchemaRef,
    fieldRef: `${interMetaMark + tableId}/${fieldId}`,
    struct
  };
};

const genSubReadFields = (colInfo, refRel: InterRefRelation) => {
  const { refFieldId, refFieldCode, refInterCode, refInterId, refShowFieldCode, refShowFieldId } = refRel;
  const { id: colId, title: desc, dataIndex, fieldCode, fieldId, tableId } = colInfo;
  return {
    refFieldInfo: {
      /** 引用表id 连表, 链接的字段id */
      table: fieldId, 
      /** 表字段code */
      field: refFieldCode,                  
      /** 别名为字段id+信息 */
      alias: `${fieldId}_${refInterId}_${refFieldId}`
    },
    showFieldInfo: {
      /** 引用表id */
      table: fieldId, 
      /** 表字段code */
      field: refShowFieldCode,                  
      /** 别名为字段id+信息 */
      alias: `${fieldId}_${refInterId}_${refShowFieldId}`
    }
  };
};

const genSubRead = (refRel: InterRefRelation) => {
  const { 
    interCode, interId, fieldId, fieldCode,
    refInterCode, refInterId, 
    refFieldId, refFieldCode 
  } = refRel;
  // const { tableCode, tableId, joinTableId, joinCode,  } = p
  return {
    table: refInterCode,
    alias: fieldId, // 连表, 链接的字段id
    joinCondition: { // 链接条件
      and: [
        {
          equ: {
            left: {
              table: interId,
              field: fieldCode,
            },
            right: {
              table: fieldId, // 连表, 链接的字段id
              field: refFieldCode
            }
          }
        }
      ]
    }
  };
};

const genJoinsInfo = ({ readDef }) => {
  return {
    readDef, // ReadOnceRefObjDef,
    /** 连接类型 */
    joinsType: 'leftJoin', // JoinsType,
    /** 连接条件 */
    // joinsCond, // refIdOfCondition;
  };
};

/**
 * 1. 生成schema
 * 2. 生成查询/组装 
 * 3. 关系连表
  "fields": [
    {
      "table": "a", // 处理多表字段名冲突；非必填
      "field": "name",
      "alias": "username"
    },
  ]
*/
const genReadTable = (transfromCtx: TransfromCtx, widgetProps, tableId) => {
  const { interMeta: { interRefRelations, interMetas }, extralDsl: { tempSchema } } = transfromCtx;
  const { id, widgetRef, propState } = widgetProps;
  const { columns } = propState;
  const tableInfo = interMetas.find(({ id: tId }) => tId === tableId);
  
  if (!tableInfo) return false;
  const pkField = tableInfo.fields.find(({ fieldDataType }) => fieldDataType === FieldDataType.PK);
  if (!pkField) return false;


  const refRelToUse = findRefRelation(interRefRelations, { tableIds: [tableId], refType: '', fields: '' });

  let idxx = 0;
  const schemaId = `${id}_DataSource`;
  /** 修改数据源 */
  propState.dataSource = schemaMark + schemaId;
  const schemaStruct: any[] = [];
  const mainReadId = `stepId${idxx}`;
  const joins: any[] = [];
  /**
   * 当前表的读取, 深度「先忽然」,额外生成的,
   */
  const readField: any[] = [];
  const readDef = {
    readRef: mainReadId,
    joins
  };
  const readList: any = {
    [mainReadId]: {
      table: tableInfo.code,
      fields: readField, alias: tableId,
    }
  };
  /** 单独添加读取pk的信息 */
  readField.push({
    /** 表id */
    table: tableId, 
    /** 表字段code */
    field: pkField.fieldCode,                  
    /** 别名为字段id+信息 */
    alias: pkField.fieldId
  });
  
  const showColumns = columns.map((col) => {
    const { fieldCode, fieldId } = col;
    const refRel = refRelToUse.find(item => item.fieldId === fieldId);
    readField.push({
      table: tableId, 
      field: fieldCode,                  
      alias: fieldId  
    });
    if (refRel) {
      schemaStruct.push(genObjSchema(col, tableId, refRel));
      /** 连表的字段 */
      const { showFieldInfo, refFieldInfo } = genSubReadFields(col, refRel);
      readField.push(refFieldInfo, showFieldInfo);
      /** 连表的read信息 */
      const readRef = `stepId${++idxx}`;;
      const read = genSubRead(refRel);
      readList[readRef] = read; // 连表的信息
      /** join信息 */
      joins.push(genJoinsInfo({ readDef: { readRef } }));
      return { ...col, dataIndex: showFieldInfo.alias };
    } 
    schemaStruct.push(genFoundationSchema(col, tableId));
    return { ...col, dataIndex: fieldId };
  });
  propState.columns = showColumns;
  propState.rowKey = pkField.fieldId; // 数据主键为 pkid
  /** 生成表格schema */
  const tableSchema = {
    schemaId,
    type: 'structArray',
    desc: '表格dataSourceSchema', schemaType: 'TableDataSource',
    schemaRef: schemaMark + tableId,
    struct: schemaStruct.reduce((res, v) => ({ ...res, [v.schemaId]: v }), {})
  };
  tempSchema.push(tableSchema);
  
  const stepsId = id;
  /** 生成连表 */
  const apbItem = {
    funcCode: FuncCodeOfAPB.R,
    stepsId,
    readList,
    readDef
  };

  return {
    reqId: REQ_MARK + id,
    reqType: 'APBDSL',
    list: {
      [stepsId]: apbItem
    },
    steps: [stepsId]
  };
  
};


export const genNormanTable = (transfromCtx: TransfromCtx, widgetProps) => {
  const { extralDsl: { tempAPIReq, tempAction, tempFlow } } = transfromCtx;
  const { id, widgetRef, propState } = widgetProps;
  const { ds, columns } = propState;
  const tableId = ds.replace('ds.', '');

  const usedColums = genTableColumns(columns, tableId);
  console.log(usedColums);
  
  propState.columns = usedColums;
  const eventHandlers: any = {};
  const APB = genReadTable(transfromCtx, widgetProps, tableId);
  if (APB) {
    tempAPIReq.push(APB);
    const actionOfIUB = {
      actionId: ACT_MARK + id,
      /** 动作名字 */
      actionName: '表格请求',
      /** 动作的类型 */
      actionType: 'APIReq',
      /** 不同动作的配置 */
      actionOptions: {
        apiReqRef: apiReqMark + APB.reqId,
      }
    };
    tempAction.push(actionOfIUB);
    const flow = genDefalutFlow(ACT_MARK + id);
    tempFlow.push(flow);
    const handler = flowEventHandlerTemplate([flow.id]);
    eventHandlers.onTableRequest = handler;
  }

  return {
    widgetId: id, widgetRef,
    propState,
    eventHandlers
    // dataSource: optDS ? `@(schema).${usedTableMetadata.id}` : '',
  };
};