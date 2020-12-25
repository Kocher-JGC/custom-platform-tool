/* eslint-disable import/no-cycle */
import { FieldDataType, SchemaType, InterMeta, InterMetaType, RefType, InterRefRelation, FieldMeta } from "@src/page-data/types";
import { groupBy } from "lodash";
import { REQ_MARK , 
  interMetaMark, splitMark , schemaMark, ref2ValMark,
  apiReqMark, runCtxPayloadMark, FLOW_MARK, flowMark,
  REF2VAL_MARK
} from "../IUBDSL-mark";

import { TransfromCtx } from "../../types/types";
import { genDefalutFlow } from './flow';
import { FuncCodeOfAPB } from './action-types-of-IUB';
import { changeStateAction } from "./genAction-update-state";
// eslint-disable-next-line import/no-cycle
import { genReadInfoFromFieldMeta, initFieldRefRelIterator, initGenReadOfFieldRefRel, IteratorFieldDef, genDefaultReadAndSetCtx, levelSplitMark, genChangePropsAndSetCtx } from "../tools";
import { initGenReadSchemaSetOfRefRel } from "../tools/APBDef-of-IUB/gen-read-schema-set";
import { genPageDataSource, genSelectPage } from "../gen-select-page";
import { genInterMeta } from "../interface-meta";

const markTransf = {
  variable: schemaMark,
  exp: '',
  realVal: '',
};
const markTransfKeys = Object.keys(markTransf);

const ref2ValArr = (ref2ValId: string, struct) => ({
  ref2ValId,
  type: 'structArray',
  struct,
});
const ref2ValObj = (ref2ValId: string, struct) => ({
  ref2ValId,
  type: 'structObject',
  struct
});

const genParamMatch = (fieldMaps, genItemFn) => {
  for (const key in fieldMaps) {
    const fieldInfo = fieldMaps[key];
    markTransfKeys.forEach(k => {
      if (fieldInfo[k]) {
        genItemFn({ key, valKey: k, fieldVal: fieldInfo[k] });
      }
    });
  }
};

/**
 * 1. 读取/回写操作 schema
 * 2. 读取 schema / set apb
 * 3. 读取 apb / set schema
 */
const genSubmitData = (transfromCtx: TransfromCtx, actionConf, actionId) => {
  const { extralDsl: { tempRef2Val, tempAPIReq, tempFlow, tempSchema } } = transfromCtx;
  const { submitData, name: actionName } = actionConf;

  const actionOfIUB = {
    actionId,
    /** 动作名字 */
    actionName,
    /** 动作的类型 */
    actionType: 'APIReq',
    /** 不同动作的配置 */
    actionOptions: {
      apiReqRef: '',
    }
    // actionOutput?: 'ActionOutput';
    // condition: string;
  };
  const steps: string[] = [];
  const APBDSLItems = {};
  const APBres = {
    reqId: REQ_MARK + actionId,
    reqType: 'APBDSL',
    // businessCode: 'string',
    list: APBDSLItems,
    steps
  };
  submitData.forEach((item, idx) => {
    const { changeFields, changeRange, id: submitId, operateType } = item;
    const temp: any = {};
    /** 每一项如何处理 */
    const genItemFn = ({ key, valKey, fieldVal }) => {
      const [tableId, fieldId] = key.split('.');
      if (Number(tableId)) {
        /** TODO: 注意此处可能经常出现问题 */
        const keyToUse = interMetaMark + tableId + splitMark + fieldId;
        const valToUse = markTransf[valKey] + (valKey === 'variable' ? fieldVal.replace(/\./g, splitMark) : fieldVal);
        (temp[tableId] || (temp[tableId] = [])).push({ key: keyToUse, val: valToUse });
      }
    };
    /** 通用迭代器 */
    genParamMatch(changeFields, genItemFn);
    if (operateType === 'insert') {
      const interIds = Object.keys(temp);
      interIds.forEach(id => {
        const stepsId = `${id}_${idx}`;
        steps.push(stepsId);
        /** 添加ID TODO: 现在默认添加 */
        tempSchema.forEach((schema) => {
          // console.log(schema);
          
          const { schemaId, schemaType, interId, fieldId } = schema;
          if ((schemaId as string).indexOf(id) === 0 || schemaType === SchemaType.interPK) {
            temp[id].push({ key: interMetaMark + interId + splitMark + fieldId, val: schemaMark + schemaId });
          }
        });
        /** 生成ref2Val */
        const ref2ValId = `${submitId}_${stepsId}`;
        const ref2Val = ref2ValArr(ref2ValId, temp[id]);
        tempRef2Val.push(ref2Val);

        APBDSLItems[stepsId] = {
          stepsId,
          funcCode: FuncCodeOfAPB.C,
          table: id,
          set: ref2ValMark+ ref2ValId
        };
      });
    }
  });

  tempAPIReq.push(APBres);
  tempFlow.push(genDefalutFlow(actionId));
  

  actionOfIUB.actionOptions.apiReqRef = apiReqMark + REQ_MARK + actionId;
  return actionOfIUB;
};

const genReadField = (interInfo: InterMeta, fieldInfo: FieldMeta, extInfo = {}) => ({
  info: {
    infoType: 'show',
    ...genReadInfoFromFieldMeta(interInfo, fieldInfo), 
    ...extInfo // info
  },
  forwardRefRels: [],
  backwardRefRels: []
});

const genReadFormData = (transfromCtx: TransfromCtx, actionConf, actionId) => {
  const { interMetaT, addPageLifecycle, extralDsl: { pageFieldsToUse, tempSchema } } = transfromCtx;
  const { getFieldAndInterInfo, getIntersRefRels, getInters } = interMetaT;
  const { actionType, name } = actionConf;
  /** 分组 */
  const pageFieldsByTableId = groupBy(pageFieldsToUse, 'tableId');
  const interIds = Object.keys(pageFieldsByTableId);
  const interInfos = getInters(interIds).reduce((res, v) => ({ ...res, [v.id]: v }), {} as { [str: string]: InterMeta });
  /** 使用到的关系 */
  const [forwardRefRels, backwardRefRels] = getIntersRefRels({ inters: interIds });
  /** 分组, 确定生成X个read, 确定主表 「TODO: 页面设计器也没有提供」 */
  const readGroup = {};

  interIds.forEach(id => {
    const mainInterInfo = interInfos[id];
    /** TODO: 非附属表, 就当作主表「如果页面添加附属表就有问题」 */
    if (mainInterInfo?.type !== InterMetaType.AUX_TABLE) {
      const { id: mainInterId, PKField: { fieldId: mainPKFieldId } } = mainInterInfo;
      const readAllFields: any[] = [ genReadField(mainInterInfo, mainInterInfo.PKField) ];
      const needReadPageFields = pageFieldsByTableId[id];
      const mainPkSchema = tempSchema.find(({ interId, fieldId }) => interId === mainInterId && mainPKFieldId === fieldId);
      const mainReadPKSchemaRef = mainPkSchema ? mainPkSchema.schemaRef : `${schemaMark + mainInterId}_${mainPKFieldId}`;
      if (mainPkSchema) {
        needReadPageFields.push({ tableId: mainInterId, fieldId: mainPKFieldId, schemaRef: mainPkSchema.schemaRef, schema: mainPkSchema });
      }

      /** 新的一组 */
      readGroup[id] = { readFields: readAllFields, mainReadPKSchemaRef, needReadPageFields };

      /** 添加附属表字段, 反向引用 */
      backwardRefRels.forEach((refRel) => {
        const { refInterId, interId } = refRel;
        if (refInterId === id && pageFieldsByTableId[interId]) {
          const FKInterInfo = interInfos[interId];
          const FkSchema = tempSchema.find(({ interId: tId, fieldId }) => interId === tId && FKInterInfo.PKField.fieldId === fieldId);
          if (FKInterInfo && FkSchema) {
            readAllFields[0].backwardRefRels.push(refRel);
            /** 辅助表字段 */
            needReadPageFields.push(...pageFieldsByTableId[interId]);
            /** 附属表主键 */
            needReadPageFields.push({ tableId: interId, fieldId: FKInterInfo.PKField.fieldId, schemaRef: FkSchema.schemaRef, schema: FkSchema });
            // readAllFields.push(genReadField(FKInterInfo, FKInterInfo.PKField));
          }
        }
      });

      needReadPageFields.forEach((pageFields) => {
        const { schema, schemaRef, tableId, fieldId } = pageFields;
        const { interInfo, fieldsInfo } = getFieldAndInterInfo({ fields: [fieldId], inter: tableId }) || {};
        if (fieldsInfo?.[0]) {
          const fieldInfo = fieldsInfo[0];
          if (fieldInfo && mainPKFieldId !== fieldInfo.fieldId) {
            const idx = readAllFields.push(genReadField(interInfo, fieldInfo)) - 1; 
            /** 有正向引用的「显示值实际值」 */
            const forwardRefRel = forwardRefRels.find(({ interId, fieldId: field }) => interId === tableId && field === fieldId);
            if (forwardRefRel) {
              readAllFields[idx].forwardRefRels.push(forwardRefRel);
              const { refFieldCode, refShowFieldCode, refInterCode, interCode, fieldCode } = forwardRefRel;
              /** TODO: 没得办法, 信息不全 */
              const codeMap = { realVal: refFieldCode, showVal: refShowFieldCode };
              const genSchemaSetItem = (prevPath) => ({
                key: schema.schemaRef,
                val: {
                  type: 'structObject',
                  struct: Object.keys(schema.struct).map((key) => ({ 
                    key, 
                    val: `${runCtxPayloadMark}[#(0|0)]${splitMark}${prevPath}${levelSplitMark}${interCode}_${fieldCode}${levelSplitMark}${refInterCode}_${codeMap[key]}` 
                  }))
                }
              });
              Object.assign(readAllFields[idx].info, { schemaSet: schema, genSchemaSetItem  });
            } else { /** 直接使用realVal */
              Object.assign(readAllFields[idx].info, { schemaSet: schemaRef });
            }
            /** ----- */
          }
          // err
        }
        // err
      });
      const { iterator, initIteratorParam, addIterationFn } = initFieldRefRelIterator({ allFields: readAllFields });
      const { iterationFn, readList } = initGenReadOfFieldRefRel();
      addIterationFn(iterationFn);
      const { iterationFn: fns, schemaSetStruct } = initGenReadSchemaSetOfRefRel();
      addIterationFn(fns);
    
      const [readDef] = iterator(
        initIteratorParam({ readFields: readAllFields, interMetaInfo: mainInterInfo }),
        [ { readAlais: `${mainInterInfo.code}A` }, { readAlais: `${mainInterInfo.code}A` } ]
      );

      /** 添加查询条件 */
      const mainReadDef = readList[readDef.readRef];
      mainReadDef.condition = mainReadPKSchemaRef;
      /** 添加schemaSet */
      const ref2Val = ref2ValObj('', schemaSetStruct);
      const { flow: setSchemaFlow } = genChangePropsAndSetCtx(transfromCtx, `set_${actionId}_${id}`, ref2Val);
      /** 生成查询 */
      const { flow } = genDefaultReadAndSetCtx(transfromCtx, { onlyMark: `${actionId}_${id}`, readList, readDef }, [flowMark + setSchemaFlow.id]);
      addPageLifecycle('mounted', flowMark + flow.id);
    };
  });
};

const genWriteFormData = (transfromCtx: TransfromCtx, actionConf, actionId) => {
  const { extralDsl: { tempAPIReq, tempAction, tempRef2Val , tempFlow, pageFieldsToUse, tempSchema } } = transfromCtx;
  const { actionType, name } = actionConf;
  /**
   * 读取 schema / set/upd apb
   */
  /** 获取完值, 进行设置值的struct */
  const tempStruct: { [str: string]: { key: string, val: string }[] } = {};
  const pkStruct: any[] = [];
  
  pageFieldsToUse.forEach(({ tableId, fieldId, schemaRef }) => {
    if (!tempStruct[tableId]) {
      const pkSchema = tempSchema.find((item) => item?.interId === tableId && item?.schemaType === SchemaType.interPK);
      if (pkSchema) {
        const struct = { key: pkSchema.code || 'id', val: pkSchema.schemaRef  };
        tempStruct[tableId] = [struct];
        pkStruct.push(struct);
      } else {
        tempStruct[tableId] = [];
      }
    } 
    tempStruct[tableId].push({ key: interMetaMark + tableId + splitMark + fieldId, val: schemaRef });
  });
  /** Create/Update */
  const ref2ValId = `ref2_${actionId}`;
  const tableIds = Object.keys(tempStruct);
  const structArr = Object.values(tempStruct);
  
  /** 生成set获取的结构 */
  const ref2ValIds = structArr.map((struct, idx) => {
    const ref2ValTemp = ref2ValArr(`${ref2ValId}_${tableIds[idx]}`, struct);
    tempRef2Val.push(ref2ValTemp);
    return ref2ValTemp.ref2ValId;
  });
  
  const steps: string[] = []; 
  const createList = {};
  const updList = {};
  tableIds.forEach((tableId, idx) => {
    const table = interMetaMark + tableId;
    const stepsId = `${tableId}_${idx}`;
    const set = ref2ValMark + ref2ValIds[idx];
    steps.push(stepsId);
    createList[stepsId] = {
      stepsId, set, table, funcCode: FuncCodeOfAPB.C,
    };
    updList[stepsId] = {
      stepsId, set, table, funcCode: FuncCodeOfAPB.U,
      condition: pkStruct[idx].val
    };
  }, {});
  
  /** 新增 */
  const APBCreateReq = {
    reqId: `${REQ_MARK + actionId}Create`,
    reqType: 'APBDSL', list: createList, steps
  };
  const actionCreate = {
    actionId: `${actionId}Create`,
    actionName: `整表新增_${name}`,
    actionType: 'APIReq',
    actionOptions: {
      apiReqRef: apiReqMark + APBCreateReq.reqId,
    }
  };
  const createFlow = genDefalutFlow(actionCreate.actionId);
  tempAPIReq.push(APBCreateReq);
  tempAction.push(actionCreate);
  tempFlow.push(createFlow);
  /** 更新 */
  const APBUpdReq = {
    reqId: `${REQ_MARK + actionId}Update`,
    reqType: 'APBDSL', list: updList, steps
  };
  const actionUpd = {
    actionId: `${actionId}Update`,
    actionName: `整表更新_${name}`,
    actionType: 'APIReq',
    actionOptions: {
      apiReqRef: apiReqMark + APBUpdReq.reqId,
    }
  };
  const updFlow = genDefalutFlow(actionUpd.actionId);
  tempAPIReq.push(APBUpdReq);
  tempAction.push(actionUpd);
  tempFlow.push(updFlow);

  const flow = {
    id: `${FLOW_MARK}${actionId}`,
    tempMark: 'skip_mark',
    actionId: '',
    flowOutCondition: ['insert', 'update'],
    flowOut: [[flowMark + createFlow.id], [flowMark + updFlow.id]]
  };
  tempFlow.push(flow);

};

const genSelectData = async (transfromCtx: TransfromCtx, actionConf, actionId) => {
  const { interMetaT, getRemoteTableMeta, extralDsl: { tempSubPage } } = transfromCtx;
  const { getInters, addInterMeta } = interMetaT;
  const { chooseData, name } = actionConf;
  const { dataChooseRange, matchReturnValue, modalConfig } = chooseData;
  const { ds, title, dsTitle, returnValue, showColumn ,tagField , selectCount, selectType, showType } = modalConfig;
  /**
   * 1. 生成表格read、表格widget
   * 2. 组装返回的ref2Val 
   */
  const dataSourceMeta = genPageDataSource([ds]);
  const newInterMeta = await genInterMeta(dataSourceMeta, getRemoteTableMeta);
  addInterMeta(newInterMeta);
  const interMeta = getInters([ds])[0];
  
  if (interMeta) {
    /** 1. 生成弹窗选择的页面 */
    const columns = [];
    interMeta.fields.forEach((fieldInfo) => {
      const { fieldId, fieldCode, name: fieldName } = fieldInfo;
      if (showColumn.includes(`${interMeta.id}.${fieldId}`)) {
        columns.push({
          title: fieldName,
          dsID: interMeta.id,
          fieldID: fieldId,
          id: `${fieldId}_${fieldCode}`,
          dataIndex: `${interMeta.code}_${fieldCode}`,
          width: 60,
          type: "dsColumn",
          align: "left",
          editable: false,
          fieldShowType: "realVal",
          show: true
        });
      }
    });
    const selectPage = await genSelectPage(transfromCtx, { dsIds: [ds], id: actionId, title, columns });
    tempSubPage.push({ id: selectPage.pageID, pageContent: selectPage });

    /** 2. 生成选择回填的 ref2val */
    // matchReturnValue
    /** action */
    const actionOfSelectData = {
      actionId,
      /** 动作名字 */
      actionName: name,
      /** 动作的类型 */
      actionType: 'openSelectModel',
      /** 不同动作的配置 */
      actionOptions: {
        openType: 'openModal',
        pageType: 'IUBDSL',
        pageArea: '1342287925089546240',
        pageUrl: selectPage.pageID,
        paramMatch: ''
      }
    };
  } else {
    // err
  }
};


const genChangeVariables = (params) => {
//   actionType: "changeVariables"
// changeVariables:
// z26xehKD.showVal: {exp: null, realVal: "3", variable: null}
// _OGJ0EsK.realVal: {exp: null, realVal: "1", variable: null}
// _OGJ0EsK.showVal: {exp: null, realVal: "2", variable: null}
// __proto__: Object
// configCn: "更改：用户名.实际值,用户名.显示值,年龄.显示值"
// name: "1"
};

const genDisplayControl = (params) => {
  // actionType: "displayControl"
  // configCn: "显示：文本框，文本框，隐藏：下拉选择器，文本框"
  // displayControl:
  // hideControl: (2) ["gJIHrcvM", "z_FsHgF-"]
  // showControl: (2) ["_OGJ0EsK", "z26xehKD"]
  // __proto__: Object
  // name: "2"
};

const genOpenPage = (transfromCtx: TransfromCtx, actionConf, actionId) => {
  const { extralDsl: { tempFlow, tempRef2Val }, pkSchemaRef } = transfromCtx;
  const { actionType, name, openPage: { link, openType, pageArea, paramMatch } } = actionConf;
  const actionOfOpenPage = {
    actionId,
    /** 动作名字 */
    actionName: name,
    /** 动作的类型 */
    actionType: 'openPage',
    /** 不同动作的配置 */
    actionOptions: {
      openType,
      pageType: 'IUBDSL',
      pageArea,
      pageUrl: link,
      paramMatch: ''
    }
  };

  if (paramMatch) {
    const ref2ValId = REF2VAL_MARK + actionId;
    const paramMatchStruct: any[] = [];

    /** 每一项如何处理 */
    const valGen = (key, fieldVal) => {
      if (key === 'variable') {
        /** 写死的固定5个, 表格选中的值 */
        // variable: "LnwMMC1I.selectedRow.1337659156915695616.1337659156949250048.realVal"
        const refArr = fieldVal.split('.');
        if (refArr.length === 5) {
          // return refArr.filter((rf,i) => ![2, 4].includes(i)).join(splitMark);
          return `${refArr[0]}${splitMark}${refArr[1]}[#(0|*)]${splitMark}${refArr[3]}`;
        }
        return refArr.join(splitMark);
      } 
      return fieldVal;
    };
    const genItemFn = ({ key, valKey, fieldVal }) => {
      const keyToUse = schemaMark + key.replace(/^var\./, '');
      const valToUse = markTransf[valKey] + valGen(valKey, fieldVal);
      paramMatchStruct.push({ key: keyToUse, val: valToUse });
    };
    /** 通用迭代器 */
    genParamMatch(paramMatch, genItemFn);
    const paramMatchRef2Val = {
      ref2ValId,
      type: "structObject",
      struct: paramMatchStruct
    };
    tempRef2Val.push(paramMatchRef2Val);
    actionOfOpenPage.actionOptions.paramMatch = ref2ValMark + ref2ValId;
  }

  tempFlow.push(genDefalutFlow(actionId));
  return actionOfOpenPage;
};

export const genAction = async (transfromCtx: TransfromCtx, actions) => {
  // const actionIds = Object.keys(actions);
  const res = {};
  for (const actionId in actions) {
    const actionConf = actions[actionId];
    switch (actionConf.actionType) {
      case 'submitData':
        res[actionId] = genSubmitData(transfromCtx, actionConf, actionId);
        break;
      case 'openPage':
        res[actionId] = genOpenPage(transfromCtx, actionConf, actionId);
        break;
      case 'readFormData':
        res[actionId] = genReadFormData(transfromCtx, actionConf, actionId);
        break;
      case 'writeFormData':
        genWriteFormData(transfromCtx, actionConf, actionId);
        break;
      case 'chooseData':
        // eslint-disable-next-line no-await-in-loop
        res[actionId] = await genSelectData(transfromCtx, actionConf, actionId);
        break;
      default:
        break;
    }
  }
  return res;
};
