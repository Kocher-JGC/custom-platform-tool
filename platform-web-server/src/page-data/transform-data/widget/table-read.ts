import { TransfromCtx, RefType, InterRefRelation, FieldMeta, FoundationType, SchemaType, InterMetaType, RelationType, ComplexType, SchemaItemDef } from "@src/page-data/types";
import { FuncCodeOfAPB } from "../task/action-types-of-IUB";
import { canDeep } from "../utils";
import { initFieldRefRelIterator } from "../tools/APBDef-of-IUB/field-ref-rel-iterator";
import { initGenReadOfFieldRefRel } from "../tools/APBDef-of-IUB/gen-read-of-field-ref-rel";
import { initGenSchemaOfFieldRefRel } from "../tools/APBDef-of-IUB/gen-schema-of-field-ref-rel";
import { REQ_MARK, genDefalutFlow } from "../task";
import { ACT_MARK, apiReqMark, schemaMark, splitMark, runCtxPayloadMark, flowMark } from "../IUBDSL-mark";
import { genChangePropsAndSetCtx } from "../tools/tools";
import { flowEventHandlerTemplate } from "./default-gen";
// import { flowEventHandlerTemplate } from "../../widget";
/** 如何写一个洋葱片迭代器 */

const connectMark = '_';

const getRefRels = ({ findRefRelation, inters }) => {
  /** 所有可以使用的引用关系 */
  const refRels = findRefRelation({ inters });
  /** 并将关系分类 「正向引用关系Forward(字典、引用、树形)、 反向引用关系backward(附属)」 */
  // const [forwardRefRels, backwardRefRels] = 
  return refRels.reduce((res, refRel) => {
    res[refRel.refType === RefType.FK_Q ? 1 : 0].push(refRel);
    return res;
  }, [[] as InterRefRelation[], [] as InterRefRelation[]]);
};

const genReadFlowAndAction = ({ widgetId, readList, readDef }) => {
  const apbItem = {
    funcCode: FuncCodeOfAPB.R,
    stepsId: widgetId,
    readList,
    readDef
  };
  const APBDefOfIUB = {
    reqId: REQ_MARK + widgetId,
    reqType: 'APBDSL',
    list: {
      [widgetId]: apbItem
    },
    steps: [widgetId]
  };
  const action = {
    actionId: ACT_MARK + widgetId,
    /** 动作名字 */
    actionName: '表格请求',
    /** 动作的类型 */
    actionType: 'APIReq',
    /** 不同动作的配置 */
    actionOptions: {
      apiReqRef: apiReqMark + APBDefOfIUB.reqId,
    }
  };
  const flow = genDefalutFlow(ACT_MARK + widgetId); // [flowMark + updStateFlow.id]

  return {
    APBDefOfIUB,
    action,
    flow
  };
};


const genTableSchema = ({ widgetId, genSchemaRes }) => {
  const getSchemaStruct = (schema) => schema?.struct || {};
  const tableSchemaRef = schemaMark + widgetId;
  const dataSourceSchemaRef = `${tableSchemaRef + splitMark}dataSource`;
  const selectedRowsSchemaRef = `${tableSchemaRef + splitMark}selectedRows`;
  const foucsRowSchemaRef = `${tableSchemaRef + splitMark}foucsRow`;
  const dataSourceStruct = getSchemaStruct(genSchemaRes(`${dataSourceSchemaRef}[#(0|*)]`));
  const selectedRowsStruct = getSchemaStruct(genSchemaRes(`${selectedRowsSchemaRef}[#(0|*)]`));
  const foucsRowStruct = getSchemaStruct(genSchemaRes(foucsRowSchemaRef));

  return {
    schemaId: widgetId, schemaRef: tableSchemaRef,
    type: ComplexType.structObject, schemaType: SchemaType.widgetTable,
    widgetRef: widgetId, desc: '表格数据模型', 
    struct: {
      dataSource: {
        schemaId: `${widgetId}_dataSource`, schemaRef: dataSourceSchemaRef,
        type: ComplexType.structArray, desc: '表格数据源',
        struct: dataSourceStruct
      },
      selectedRows:  {
        schemaId: `${widgetId}_selectedRows`, schemaRef: selectedRowsSchemaRef,
        type: ComplexType.structArray, desc: '表格选中行',
        struct: selectedRowsStruct
      },
      foucsRow: {
        schemaId: `${widgetId}_foucsRow`, schemaRef: foucsRowSchemaRef,
        type: ComplexType.structObject, desc: '表格当前操作行(/记录)',
        struct: foucsRowStruct
      },
      pageSize: {
        schemaId: `${widgetId}_pageSize`, schemaRef: `${tableSchemaRef + splitMark}pageSize`,
        type: FoundationType.number, desc: '表格每页记录数',
      },
      currentPage: {
        schemaId: `${widgetId}_currentPage`, schemaRef: `${tableSchemaRef + splitMark}currentPage`,
        type: FoundationType.number, desc: '当前页码',
      },
      total: {
        schemaId: `${widgetId}_total`, schemaRef: `${tableSchemaRef + splitMark}total`,
        type: FoundationType.number, desc: '表格记录总数',
      },
    }
  };
};

export const genTableRead = (transfromCtx: TransfromCtx, widgetProps) => {
  const { interMetaT, logger, extralDsl: { tempSchema, tempFlow, tempAPIReq, tempAction } } = transfromCtx;
  const { getInters, findRefRelation, getFieldAndInterInfo } = interMetaT;
  const { id: widgetId, widgetRef, propState } = widgetProps;
  const { ds: dsIds, columns } = propState;
  const intersMeta = getInters(dsIds);
  const eventHandlers: any = {};
  const genResult = { eventHandlers };
  // const { genOnceSchema, genGroupSchema, getSchemaGenRes } = schema;

  if (intersMeta.length === dsIds?.length) {
    /** 单独添加读取pk的信息 */
    intersMeta.forEach((interMeta, idx) => {
      const { PKField } = interMeta;
      const { fieldId, fieldCode } = PKField;
      columns.push({
        dsID: dsIds[idx], fieldID: fieldId, show: false,
        field: fieldCode, id: fieldId, title: `主键(PK)${fieldId}`
      });
    });
    /**
     * 表格的schema/readField「根据column+引用关系生成」
     */
    /** 等于树形的-1 */
    const mainInterMeta = intersMeta.find(({ type }) => type !== InterMetaType.AUX_TABLE);
    if (mainInterMeta) {
      const PKFieldInfo = mainInterMeta.PKField;
      /** 获取所有正向关系和反向关系 */
      const [forwardRefRels, backwardRefRels] = getRefRels({ findRefRelation, inters: dsIds });
  
      const allFields: any[] = [];
      const idMapDataIdx = {};
      /** 每一项 */
      columns.forEach((colInfo) => {
        const { title, id, type, dataIndex, fieldShowType, fieldID, dsID } = colInfo;
        const metaInfo = getFieldAndInterInfo({ field: fieldID, inter: dsID });
        
        if (metaInfo) {
          const { fieldInfo, interInfo } = metaInfo;
          const forwardRefRelsToUse = forwardRefRels.filter(({ fieldId }) => fieldId === fieldID);
          const backwardRefRelsToUse = backwardRefRels.filter(({ refFieldId }) => refFieldId === fieldID);
          const fieldRes = {
            info: { 
              fieldId: fieldID, interId: dsID,
              interCode: interInfo.code, fieldCode: fieldInfo.fieldCode,
              widgetId, desc: title, colId: id,
            },
            forwardRefRels: forwardRefRelsToUse,
            backwardRefRels: backwardRefRelsToUse
          };
          allFields.push(fieldRes);
          idMapDataIdx[`${dsID}:${fieldID}`] = dataIndex;
        } else {
          // err
        }
      });

      /** 初始化迭代器, 添加迭代处理函数 */
      const { readList, iterationFn } = initGenReadOfFieldRefRel();
      const { schemaFnHandler } = initGenSchemaOfFieldRefRel(idMapDataIdx);
      const { iterator, addIterationFn } = initFieldRefRelIterator({ allFields });
      addIterationFn(iterationFn);
      addIterationFn(schemaFnHandler);

      /** 迭代器初始化的上下文 */
      const initialCtx = [
        { readAlais: `${mainInterMeta.code}A` },
        {
          prevPath: '', readAlais: `${mainInterMeta.code}A`,
          genSctrctItemFns: [], genSctrctSetFns: []
        }
      ];
      const iterationRes = iterator({ 
        level: 0, readFields: allFields,
        prevFieldId: '', prevReadId: '',
        prevReadCode: '', prevFieldCode: '',
        readId: mainInterMeta.id, fieldId: '',
        readCode: mainInterMeta.code, fieldCode: '', 
      }, initialCtx);

      /**
       * 1. 表的schema、readFields 「生成实际的showColumns」
       * 2. 选择器的 事件/动作
       * 3. tableReq 事件/动作
       */
      const mainReadDef = iterationRes[0];
      const { genSchemaRes, genSchemaSet } = iterationRes[1];
      const tableSchema = genTableSchema({ widgetId, genSchemaRes });
      tempSchema.push(tableSchema);
      
      /** 表格选中 */
      const { ref2Val, flow: selStateFlow } = genChangePropsAndSetCtx(transfromCtx, `${widgetId}_selectedRows`, tableSchema.struct.selectedRows.schemaRef);
      /** 临时的 */
      ref2Val.struct.push(
        {
          val: `${runCtxPayloadMark+splitMark}selectedRows[#(0|*)]${splitMark}${PKFieldInfo.fieldId}`,
          key: `${schemaMark+mainInterMeta.id}_${PKFieldInfo.fieldId}`
        }
      );
      /** 数据写入schema */
      const dataSourceSchemaRef = tableSchema.struct.dataSource.schemaRef;
      const { flow: setSchemaFlow, ref2Val: ref2ValSchemaSet } = genChangePropsAndSetCtx(transfromCtx, `${widgetId}_setDataSource`, dataSourceSchemaRef);
      /** request的后映射 */
      const ref2ValSchemaSetStruct = genSchemaSet(`${runCtxPayloadMark}[#(0|*)]/`);
      ref2ValSchemaSetStruct.key = dataSourceSchemaRef;
      Object.assign(ref2ValSchemaSet, {
        struct: [ref2ValSchemaSetStruct]
      });
      /**
       * APB
       * 1. 生成连表
       * 2. 写入数据
       */
      const { APBDefOfIUB, action, flow } = genReadFlowAndAction({ widgetId, readList, readDef: mainReadDef });
      flow.flowOut = [[flowMark + setSchemaFlow.id]];
      tempAPIReq.push(APBDefOfIUB);
      tempAction.push(action);
      tempFlow.push(flow); 
      
      eventHandlers.onTableRequest = flowEventHandlerTemplate([flow.id]);
      eventHandlers.onTableSelect = flowEventHandlerTemplate([selStateFlow.id]);
      /** 修改columns */
      // TODO: 这有个不好的默认规则
      propState.columns = columns.map((_) => ({ ..._, dataIndex: idMapDataIdx[`${_.dsID}:${_.fieldID}`] || _.dataIndex }));
      propState.dataSource = dataSourceSchemaRef; // 默认是dataSource
      propState.rowKey = `${mainInterMeta.code}_${PKFieldInfo.fieldCode}`; // 数据主键为 pkid
    }
    // err

  }
  // err
  return genResult;
};
