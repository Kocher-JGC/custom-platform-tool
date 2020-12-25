import { TransfromCtx, FieldMeta, InterMeta, FieldAndInterInfo, ComplexType, SchemaType } from "../../types";
import { flowMark, interMetaMark, schemaMark, splitMark, runCtxPayloadMark } from "../IUBDSL-mark";
import { initFieldRefRelIterator, initGenReadOfFieldRefRel, genChangePropsAndSetCtx, genDefaultReadAndSetCtx, genReadInfoFromFieldMeta } from "../tools";
import { defaultGenEvents } from "./default-gen";
import { changeWidgetProps, genDefalutFlow } from "../task";

// {
//   "field": null,
//   "widgetCode": "DropdownSelector.4",
//   "optDS": "ds.1337304350342656000",
//   "sortInfo": [
//       {
//           "dsID": "1337304350342656000",
//           "fieldID": "1341352359627993089",
//           "sort": "ASC", // DESC
//           "title": "用户.性别"
//       },
//   ],
//   "showValField": "1337304417338273793",
//   "realValField": "1337304350372016140",
//   "realValDefault": "0",
//   "labelColor": null,
//   "title": "下拉选择",
//   "dropdownMultiple": null,
//   "startSearch": null,
//   "checkFixedRule": null,
//   "checkCustomRule": null,
//   "checkErrorTooltip": null,
//   "eventRef": null
// }

/**
 * 因页面设计器不提供变量, 临时生成
 */
const selectSchemaTemp = (widgetId, realValDefault) => {
  const gen = (str) => widgetId+str;
  return [
    {
      type: ComplexType.structObject,
      schemaId: widgetId,
      desc: '下拉框数据模型',
      schemaType: SchemaType.widget,
      schemaRef: schemaMark + widgetId,
      widgetRef: widgetId,
      struct: {
        realVal: {
          schemaId: gen('_realVal'),
          type: 'string',
          desc: '下拉框实际值',
          schemaRef: schemaMark + gen(`${splitMark}realVal`),
          schemaKey: 'realVal',
          defaultVal: realValDefault,
        },
        showVal: {
          schemaId: gen('_showVal'),
          type: 'string',
          desc: '下拉框显示值',
          schemaRef: schemaMark + gen(`${splitMark}showVal`),
          schemaKey: 'showVal',
          defaultVal: '',
        },
      }
    },
    {
      type: ComplexType.structArray,
      schemaId: `${widgetId}_dataSource`,
      desc: '下拉框数据',
      schemaType: SchemaType.widget,
      schemaRef: `${schemaMark  }${widgetId}_dataSource`,
      widgetRef: widgetId,
      struct: {
        realVal: {
          schemaId: gen('_dataSource_realVal'),
          type: 'string',
          desc: '实际值',
          schemaRef: schemaMark + gen(`_dataSource${splitMark}realVal`),
        },
        showVal: {
          schemaId: gen('_dataSource_showVal'),
          type: 'string',
          desc: '显示值',
          schemaRef: schemaMark + gen(`_dataSource${splitMark}showVal`),
        },
      }
    }
  ];
};

/** TODO: 因为schema默认写死, 那么setSchema也写死先 */
const genSetSchemaOfSelectDataSource = (schema, readFields: any[]) => {
  return {
    type: ComplexType.structObject,
    struct: [
      {
        key: schema.schemaRef,
        val: {
          type: ComplexType.structArray,
          struct: [
            {
              key: 'showVal',
              val: `${runCtxPayloadMark}[#(1|*)]${splitMark}${readFields[0].alias}`
            },
            {
              key: 'realVal',
              val: `${runCtxPayloadMark}[#(1|*)]${splitMark}${readFields[1].alias}`
            }
          ]
        }
      }
    ]
  };
};

/**
 * 1. 读取并写入schema
 */
const genSelectRead = (transfromCtx: TransfromCtx, widgetId, metaInfo: FieldAndInterInfo, extraGen) => {
  const { extralDsl: { pageLifecycle }, addPageLifecycle } = transfromCtx;
  const { interInfo, fieldsInfo } = metaInfo;
  const allFields = [];
  fieldsInfo.forEach((fieldInfo, idx) => {
    if (fieldInfo) {
      const info = idx === 0 ? { desc: '下拉显示值', infoType: 'show' } : { desc: '下拉引用值', infoType: 'ref' };
      allFields.push({
        info: {
          ...genReadInfoFromFieldMeta(interInfo, fieldInfo),
          ...info,
          widgetId,
        }
      });
    }
  });
  
  const { iterator, initIteratorParam, addIterationFn } = initFieldRefRelIterator({ allFields });
  const { iterationFn, readList, readFields } = initGenReadOfFieldRefRel();
  addIterationFn(iterationFn);

  const initialCtx = [
    { readAlais: `${interInfo.code}A` }
  ];
  const [readDef] = iterator(
    initIteratorParam({ readFields: allFields, interMetaInfo: interInfo }), initialCtx
  );

  const { ref2Val } = extraGen({ readFields });
  /** 设置schema的流程 */
  const { flow: setSchemaFlow } = genChangePropsAndSetCtx(transfromCtx, `${widgetId}_setDataSource`, ref2Val);
  /** 读取数据的流程 */
  const { flow } = genDefaultReadAndSetCtx(transfromCtx, { onlyMark: widgetId, readList, readDef }, [flowMark + setSchemaFlow.id]);

  /** 添加页面onload事件 */
  addPageLifecycle('mounted', flowMark + flow.id);
};

const selectOnChange = (transfromCtx: TransfromCtx, widgetConf) => {
  const { id, propState, } = widgetConf;
  const { extralDsl: { tempFlow, tempAction } } = transfromCtx;
  let { eventRef = {} } = propState;
  if (!eventRef) eventRef = {};
  const actionId = `${id}_changeWidgetProps`;
  const action = changeWidgetProps(actionId);
  const flow = genDefalutFlow(actionId);
  tempAction.push(action);
  tempFlow.push(flow);
  eventRef.onPropsChange = [flow.id];

  return defaultGenEvents(eventRef);
};


export const genSelect = (transfromCtx: TransfromCtx, widgetConf) => {
  const { id, widgetRef, propState } = widgetConf;
  const { widgetCode, optDS, showValField, realValField, realValDefault, field } = propState || {};
  const {
    interMetaT, schema, setPageFields, extralDsl: { tempSchema, pageFieldsToUse }
  } = transfromCtx;
  const { getFieldAndInterInfo } = interMetaT;
  const interId = optDS.replace('ds.', '');
  const readFieldsMark = [showValField || 'name', realValField || 'code'];
  propState.interMeta = interMetaMark + interId;
  /** 页面设计器无页面变量, 默认生成一个 */
  const selectSchema = selectSchemaTemp(id, realValDefault);
  tempSchema.push(...selectSchema);
  const realValSchemaRef = selectSchema[0].struct.realVal.schemaRef; 
  propState.realVal = realValSchemaRef;

  if (field) {
    setPageFields(propState.field, selectSchema[0], realValSchemaRef);
  }
  const eventHandleToUse = selectOnChange(transfromCtx, widgetConf);
  
  // showKey = "name",
  // valueKey = "code",
  const metaInfo = getFieldAndInterInfo({ fields: readFieldsMark, inter: interId });

  const extraGen = ({ readFields }) => {
    const ref2Val = genSetSchemaOfSelectDataSource(selectSchema[1], readFields);
    propState.dataSource = selectSchema[1].schemaRef;
    return { ref2Val };
  };
  genSelectRead(transfromCtx, id, metaInfo, extraGen);

  return {
    widgetId: id, widgetRef, propState, widgetCode,
    eventHandlers: {
      ...eventHandleToUse
    },
  };
};