import { FieldDataType } from "@src/page-data/types";
import { 
  interMetaMark, splitMark , schemaMark, ref2ValMark,
  apiReqMark, runCtxPayloadMark, FLOW_MARK, flowMark,
  REF2VAL_MARK
} from "../IUBDSL-mark";
import { genOpenPageAction } from './genAction-open-model';
import { TransfromCtx } from "../../types/types";
import { genAPBDSLAction } from "./genAction-APB";
import { genDefalutFlow } from './flow';
import { FuncCodeOfAPB } from './action-types-of-IUB';
import { changeStateAction } from "./genAction-update-state";

export const REQ_MARK = 'req_';

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
          const { schemaId, schemaType, code } = schema;
          if ((schemaId as string).indexOf(id) === 0 || schemaType === 'TablePK') {
            temp[id].push({ key: code, val: schemaMark + schemaId });
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

const readOnce = ({ readList, stepsId }) => ({
  funcCode: FuncCodeOfAPB.R,
  stepsId,
  readList,
  readDef: { readRef: 'staticId' }
});
const genReadFormData = (transfromCtx: TransfromCtx, actionConf, actionId) => {
  const { extralDsl: { tempAPIReq, tempAction, tempRef2Val , tempFlow, pageFieldsToUse, pageLifecycle }, interMeta: { interMetas } } = transfromCtx;
  const { actionType, name } = actionConf;
  /**
   * 1. 读取/回写操作 schema
   * 2. 读取 schema / set apb
   * 3. 读取 apb / set schema
   */
  const tempInfo: any = {};
  /** 获取完值, 进行设置值的struct */
  const struct: { key: string, val: string }[] = [];
  pageFieldsToUse.forEach(({ tableId, fieldId, schemaRef }) => {
    let fieldInfo ;
    if (tempInfo[tableId]) {
      fieldInfo = tempInfo[tableId].fieldsInfo.find(({ fieldId: id }) => id === fieldId);
    } else {
      const interInfo = interMetas.find(({ id }) => id === tableId);
      if (interInfo) {
        const PKInfo = interInfo.fields.find(({ fieldDataType }) =>  fieldDataType === FieldDataType.PK);
        const PKSchemaRef = `${schemaMark + tableId}_${PKInfo.fieldId}`;
        fieldInfo = interInfo.fields.find(({ fieldId: id }) => id === fieldId);
        tempInfo[tableId] = {
          interInfo,
          fieldsInfo: interInfo.fields,
          alias: interInfo.id,
          stepsId: interInfo.id,
          table: interInfo.code,
          fields: [{ table: tableId,  field: PKInfo.fieldCode, alias: PKInfo.fieldId }],
          condition: PKSchemaRef
          // condition: {
          //   and: [{
          //     equ: {
          //       [PKInfo.fieldCode]: PKSchemaRef
          //     }
          //   }]
          // }
        };
        struct.push({ key: PKSchemaRef, val: `${runCtxPayloadMark}[#(0|0)]${splitMark}${PKInfo.fieldId}` });
      }
    }
    if (fieldInfo) {
      tempInfo[tableId].fields.push({ table: tableId,  field: fieldInfo.fieldCode, alias: fieldInfo.fieldId });
      struct.push({ key: schemaRef, val: `${runCtxPayloadMark}[#(0|0)]${splitMark}${fieldInfo.fieldId}` });
    }
  });
  /** 读取完写入动作 */
  const ref2ValId = `ref2_${actionId}`;
  const ref2ValTemp = ref2ValObj(ref2ValId, struct);
  const changeStateAct = changeStateAction(ref2ValId, ref2ValMark + ref2ValId);
  tempRef2Val.push(ref2ValTemp);
  tempAction.push(changeStateAct);
  /** 读取完写入动作 */
  /** APB读取动作 */
  const steps: string[] = [];
  
  const APBReq = {
    reqId: REQ_MARK + actionId,
    reqType: 'APBDSL',
    list: Object.values(tempInfo).reduce((res, item: any)=> {
      const { stepsId, table, fields, alias, condition } = item;
      steps.push(stepsId);
      res[stepsId] = readOnce({ stepsId, readList: {
        staticId: {
          table, stepsId,
          funcCode: FuncCodeOfAPB.R,
          fields, alias,
          condition,
        }
      } });
      return res;
    }, {}),
    steps
  };
  tempAPIReq.push(APBReq);
  const action = {
    actionId,
    actionName: `页面表单读取_${name}`,
    actionType: 'APIReq',
    actionOptions: {
      apiReqRef: apiReqMark + APBReq.reqId,
    }
  };
  tempAction.push(action);
  /** APB读取动作 - end */

  /** 拼接动作 */
  const reqFlow =  action.actionId;
  const setFlow =  changeStateAct.actionId;
  const flowItem1: any = genDefalutFlow(reqFlow, [ flowMark + FLOW_MARK + setFlow ]);
  flowItem1.condition = 'update_get';
  const flowItem2 = genDefalutFlow(setFlow);
  tempFlow.push(flowItem1, flowItem2);
  /** 页面加载时候的生命周期 */
  pageLifecycle.mounted = [flowMark + FLOW_MARK + reqFlow];
  return action;
};

const genWriteFormData = (transfromCtx: TransfromCtx, actionConf, actionId) => {
  const { extralDsl: { tempAPIReq, tempAction, tempRef2Val , tempFlow, pageFieldsToUse, pageLifecycle, tempSchema }, interMeta: { interMetas } } = transfromCtx;
  const { actionType, name } = actionConf;
  /**
   * 读取 schema / set/upd apb
   */
  /** 获取完值, 进行设置值的struct */
  console.log(tempSchema);
  const tempStruct: { [str: string]: { key: string, val: string }[] } = {};
  const pkStruct: any[] = [];
  console.log(pageFieldsToUse);
  
  pageFieldsToUse.forEach(({ tableId, fieldId, schemaRef }) => {
    if (!tempStruct[tableId]) {
      const pkSchema = tempSchema.find((item) => item?.interId === tableId && item?.schemaType === 'TablePK');
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

export const genAction = (transfromCtx: TransfromCtx, actions) => {
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
      default:
        break;
    }
  }
  return res;
};
