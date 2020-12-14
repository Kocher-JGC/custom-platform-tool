import { interMetaMark, schemaMark, REQ_MARK, ACT_MARK, apiReqMark, splitMark, REF2VAL_MARK, flowMark, ref2ValMark, runCtxPayloadMark } from '../IUBDSL-mark';
import { TransfromCtx, InterRefRelation, FieldDataType } from "../../types";
import { omitObj } from "../utils";
import { FuncCodeOfAPB } from "../task/action-types-of-IUB";
import { genDefalutFlow, changeStateAction, payloadRef2ValTemplate } from '../task';
import { flowEventHandlerTemplate } from './default-gen';
import { genDefaultTableDelBtn } from './normal-button';

const omitColKey = ['colDataType', 'fieldSize', 'fieldType'];

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

const genFoundationSchemaFn = (colInfo) => {
  const { title: desc, dataIndex, fieldCode, fieldID, dsID } = colInfo;
  return (prevPath) => {
    return {
      schemaId: fieldID,
      type: 'string',
      desc, schemaType: 'TableDataSource',
      schemaRef: `${schemaMark + prevPath}[#(0|*)]/${fieldID}`,
      fieldRef: `${interMetaMark + dsID}/${fieldID}`
    };
  };
};

const genObjSchemaFn = (colInfo, refRel: InterRefRelation) => {
  const { 
    refFieldId, refFieldCode, refInterCode, 
    refInterId, refShowFieldCode, refShowFieldId,
    fieldId, interId,
  } = refRel;
  const { id: colId, title: desc, dataIndex, fieldCode } = colInfo;
  return (prevPath) => {
    const baseSchemaRef = `${schemaMark + prevPath}[#(0|*)]/${fieldId}`;
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
      fieldRef: `${interMetaMark + interId}/${fieldId}`,
      struct
    };
  };
};

const genSubReadFields = (colInfo, refRel: InterRefRelation) => {
  const {  fieldId, refFieldId, refFieldCode, refInterCode, refInterId, refShowFieldCode, refShowFieldId } = refRel;
  // const { id: colId, title: desc, dataIndex, fieldCode, fieldId, tableId } = colInfo;
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
  const { 
    interMeta: { interRefRelations, interMetas }, 
    extralDsl: { tempSchema, tempRef2Val, tempAction, tempFlow, tempAPIReq }
  } = transfromCtx;
  const { id, widgetRef, propState } = widgetProps;
  const { columns } = propState;
  const tableInfo = interMetas.find(({ id: tId }) => tId === tableId);
  const genResult: any = {};
  if (!tableInfo) return genResult;
  const pkField = tableInfo.fields.find(({ fieldDataType }) => fieldDataType === FieldDataType.PK);
  if (!pkField) return genResult;

  const refRelToUse = findRefRelation(interRefRelations, { tableIds: [tableId], refType: '', fields: '' });

  let idxx = 0;
  const schemaId = `${id}`;
  /** 修改数据源 */
  propState.dataSource = `${schemaMark + schemaId + splitMark}dataSource`; // 默认是dataSource
  const tableSchemaGenFn: any[] = [];
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
  columns.push({
    dsID: tableId, fieldID: pkField.fieldId, show: false,
    field: pkField.fieldCode, id: pkField.fieldId, desc: 'PK'
  });

  const showColumns = columns.map((col) => {
    const { dsID, fieldID } = col;
    const ds = interMetas.find(item => item.id === dsID);
    const refRel = refRelToUse.find(item => item.fieldId === fieldID);
    const fieldInfo = ds.fields.find((item) => item.fieldId === fieldID);
    if (ds && fieldInfo) {
      readField.push({
        table: tableId,
        field: fieldInfo.fieldCode,
        alias: fieldID
      });
      if (refRel) {
        tableSchemaGenFn.push(genObjSchemaFn(col, refRel));
        /** 连表的字段 */
        const { showFieldInfo, refFieldInfo } = genSubReadFields(col, refRel);
        readField.push(refFieldInfo, showFieldInfo);
        /** 连表的read信息 */
        const readRef = `stepId${++idxx}`;;
        const read = genSubRead(refRel);
        readList[readRef] = read; // 连表的信息
        /** join信息 */
        joins.push(genJoinsInfo({ readDef: { readRef } }));
        return { ...col, dataIndex: showFieldInfo.alias, id: showFieldInfo.alias };
      } 
      tableSchemaGenFn.push(genFoundationSchemaFn(col));
      return { ...col, dataIndex: fieldID, id: fieldID };
    }
    return null;
  }).filter(v => v);
  propState.columns = showColumns;
  propState.rowKey = pkField.fieldId; // 数据主键为 pkid
  /**
   * 生成表格schema
   * 1. 数据源schema
   * 2. 选中行的schema
   * 3. 当前操作的schema 「后续」
   */
  /** 数据源 */
  const tableDataSourceRef = `${id + splitMark}dataSource`;
  const dataSourceSchema = tableSchemaGenFn.map(genFn => genFn(tableDataSourceRef)).reduce((res, v) => ({ ...res, [v.schemaId]: v }), {});
  const tableSelectRowRef = `${id + splitMark}selectedRow`;
  const selectRowSchema = tableSchemaGenFn.map(genFn => genFn(tableSelectRowRef)).reduce((res, v) => ({ ...res, [v.schemaId]: v }), {});
  const tableSchema = {
    schemaId,
    type: 'structObject',
    desc: '表格数据模型', schemaType: 'TableSchema',
    schemaRef: schemaMark + tableId,
    struct: {
      dataSource: {
        schemaId: `${schemaId}dataSource`,
        type: 'structArray',
        desc: '表格dataSource模型', schemaType: 'TableDataSourceSchema',
        schemaRef: schemaMark + tableDataSourceRef,
        struct: dataSourceSchema
      },
      selectedRow: {
        schemaId: `${schemaId}selectedRow`,
        type: 'structArray',
        desc: '表格选中的模型', schemaType: 'TableSelectedRowSchema',
        schemaRef: schemaMark + tableSelectRowRef,
        struct: selectRowSchema
      }
    }
    // struct: schemaStruct.reduce((res, v) => ({ ...res, [v.schemaId]: v }), {})
  };
  tempSchema.push(tableSchema);
  /** 数据写入schema */
  const setDataId = `${schemaId}_setDataSource`;
  const ref2Val = payloadRef2ValTemplate(setDataId, schemaMark + tableDataSourceRef);
  const updStateAction = changeStateAction(setDataId, ref2ValMark + setDataId);
  const updStateFlow = genDefalutFlow(setDataId);
  tempRef2Val.push(ref2Val);
  tempAction.push(updStateAction);
  tempFlow.push(updStateFlow);
  
  const selDataId = `${schemaId}_selectedRow`;
  const selectRef2Val = {
    ref2ValId: selDataId,
    type: 'structObject',
    struct: [
      {
        val: `${runCtxPayloadMark+splitMark}selectedRows`,
        key: schemaMark + tableSelectRowRef,
      },
      {
        val: `${runCtxPayloadMark+splitMark}selectedRows[#(0|*)]${splitMark}${pkField.fieldId}`,
        key: `${schemaMark+tableId}_${pkField.fieldId}`
      }
    ]
  };
  const selectChange = changeStateAction(selDataId, ref2ValMark + selDataId);
  const selStateFlow = genDefalutFlow(selDataId);
  tempRef2Val.push(selectRef2Val);
  tempAction.push(selectChange);
  tempFlow.push(selStateFlow);
  genResult.onTableSelect = flowEventHandlerTemplate([selStateFlow.id]);
  /**
   * APB
   * 1. 生成连表
   * 2. 写入数据
   */
  const stepsId = id;
  const apbItem = {
    funcCode: FuncCodeOfAPB.R,
    stepsId,
    readList,
    readDef
  };
  const APB = {
    reqId: REQ_MARK + id,
    reqType: 'APBDSL',
    list: {
      [stepsId]: apbItem
    },
    steps: [stepsId]
  };
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
  const flow = genDefalutFlow(ACT_MARK + id, [flowMark + updStateFlow.id]);
  tempFlow.push(flow);
  genResult.onTableRequest = flowEventHandlerTemplate([flow.id]);
  return genResult;
};


export const genNormanTable = (transfromCtx: TransfromCtx, widgetProps) => {
  const { pkSchemaRef } = transfromCtx;
  const { id, widgetRef, propState } = widgetProps;
  const { ds: tableIds, columns } = propState;
  const delBtn = genDefaultTableDelBtn(transfromCtx, { table: interMetaMark + tableIds[0], condition: pkSchemaRef[0] });
  // const tableIds = ds.replace('ds.', '');

  // const usedColums = genTableColumns(columns, tableId);

  // propState.columns = usedColums;
  const eventHandlers = genReadTable(transfromCtx, widgetProps, tableIds[0]);

  return [
    delBtn,
    {
      widgetId: id, widgetRef,
      propState,
      eventHandlers
      // dataSource: optDS ? `@(schema).${usedTableMetadata.id}` : '',
    }
  ];
};
