import { TransfromCtx, RefType, InterRefRelation, FieldMeta, FoundationType, SchemaType, InterMetaType, RelationType, ComplexType, SchemaItemDef } from "@src/page-data/types";
import { initFieldRefRelIterator } from "../tools/APBDef-of-IUB/field-ref-rel-iterator";
import { initGenReadOfFieldRefRel } from "../tools/APBDef-of-IUB/gen-read-of-field-ref-rel";
import { initGenSchemaOfFieldRefRel } from "../tools/APBDef-of-IUB/gen-schema-of-field-ref-rel";
import { schemaMark, splitMark, runCtxPayloadMark, flowMark } from "../IUBDSL-mark";
import { genChangePropsAndSetCtx, genDefaultReadAndSetCtx } from "../tools";
import { flowEventHandlerTemplate } from "./default-gen";
/** 如何写一个洋葱片迭代器 */

const connectMark = '_';

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
  const { getInters, getIntersRefRels, getFieldAndInterInfo } = interMetaT;
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
      const [forwardRefRels, backwardRefRels] = getIntersRefRels({ inters: dsIds });
  
      const allFields: any[] = [];
      const idMapDataIdx = {};
      /** 每一项 */
      columns.forEach((colInfo) => {
        const { title, id, type, dataIndex, fieldShowType, fieldID, dsID } = colInfo;
        const metaInfo = getFieldAndInterInfo({ fields: [fieldID], inter: dsID });
        
        if (metaInfo) {
          const { fieldsInfo, interInfo } = metaInfo;
          const forwardRefRelsToUse = forwardRefRels.filter(({ fieldId }) => fieldId === fieldID);
          const backwardRefRelsToUse = backwardRefRels.filter(({ refFieldId }) => refFieldId === fieldID);
          const fieldRes = {
            info: { 
              fieldId: fieldID, interId: dsID,
              interCode: interInfo.code, fieldCode: fieldsInfo[0].fieldCode,
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
      const { iterator, initIteratorParam, addIterationFn } = initFieldRefRelIterator({ allFields });
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
      const iterationRes = iterator(
        initIteratorParam({ readFields: allFields, interMetaInfo: mainInterMeta }), initialCtx
      );

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
          val: `${runCtxPayloadMark+splitMark}selectedRowKeys[#(0|0)]`,
          key: `${schemaMark+mainInterMeta.id}_${PKFieldInfo.fieldId}`
        }
      );
      /** 数据写入schema */
      const dataSourceSchemaRef = tableSchema.struct.dataSource.schemaRef;
      const { flow: setSchemaFlow, ref2Val: ref2ValSchemaSet } = genChangePropsAndSetCtx(transfromCtx, `${widgetId}_setDataSource`, dataSourceSchemaRef);
      /** request的后映射 */
      const ref2ValSchemaSetStruct = genSchemaSet(`${runCtxPayloadMark}[#(1|*)]/`);
      ref2ValSchemaSetStruct.key = dataSourceSchemaRef;
      Object.assign(ref2ValSchemaSet, {
        struct: [ref2ValSchemaSetStruct]
      });
      /**
       * APB
       * 1. 生成连表
       * 2. 写入数据
       */
      const { flow } = genDefaultReadAndSetCtx(transfromCtx, { onlyMark: widgetId, readList, readDef: mainReadDef }, [flowMark + setSchemaFlow.id]);
      
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
