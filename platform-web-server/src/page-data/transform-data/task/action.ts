import { schemaMark, ref2ValMark, apiReqMark } from "../IUBDSL-mark";
import { genOpenPageAction } from './genAction-open-model';
import { TransfromCtx } from "../../types/types";
import { genAPBDSLAction } from "./genAction-APB";
import { genDefalutFlow } from './flow';
import { FuncCodeOfAPB } from './action-types-of-IUB';

export const REQ_MARK = 'req_';

/**
 * 旧的有很多默认逻辑
 */
export const genAction2 = (transfromCtx: TransfromCtx, actions, { pageSchema })  => {
  const { extralDsl: { tempFlow } } = transfromCtx;
  let res = {};
  const actionIds = Object.keys(actions);
  actionIds.forEach(id => {
    const action = actions[id][0];
    if (action) {
      const { triggerAction, event, action: { pageID } } = action;
      if (triggerAction === 'submit' && event === 'onClick') {
        res = {
          ...res,
          ...genAPBDSLAction(transfromCtx, id, action, pageSchema)
        };
      }
      if (triggerAction === 'openPage' && pageID) {
        res[id] = genOpenPageAction(transfromCtx, id, action);
        tempFlow.push(genDefalutFlow(id));
        transfromCtx.extralDsl.tempOpenPageUrl = pageID; /** 临时的url */
      }
    } else {
      console.error('获取action失败');
    }
  });

  return res;
};

const markTransf = {
  variable: schemaMark,
  exp: '',
  realVal: '',
};
const markTransfKeys = Object.keys(markTransf);

const template = (ref2ValId: string, struct) => ({
  ref2ValId,
  type: 'structArray',
  struct,
});

const genSubmitData = (transfromCtx: TransfromCtx, action, actionId) => {
  const { extralDsl: { tempRef2Val, tempAPIReq, tempFlow, tempSchema } } = transfromCtx;
  // actionType: "submitData"
  // name: "🫀"
  // submitData: Array(1)
  //   changeFields: {user.alias: {…}, user.age: {…}, user.username: {…}, user_hobby.desc: {…}, user_hobby.hobby: {…}}
  //   changeRange: null
  //   id: "act.submitData.0.pbo9LJt3"
  //   operateType: "insert"
  //   tableCode: "user"
  //   tableId: "1335774384572473344"
  //   tableName: "用户
  const { submitData, name: actionName } = action;

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
    for (const key in changeFields) {
      const fieldInfo = changeFields[key];
      markTransfKeys.forEach(k => {
        if (fieldInfo[k]) {
          const [tableCode, fieldCode] = key.split('.');
          /** TODO: 注意此处可能经常出现问题 */
          // const ref2ValMap = 
          (temp[tableCode] || (temp[tableCode] = [])).push({ key, val: markTransf[k] + fieldInfo[k].replace(/\./g, '/') });
        }
      });
    }
    if (operateType === 'insert') {
      const tableCodes = Object.keys(temp);
      tableCodes.forEach(code => {
        const stepsId = `${code}_${idx}`;
        steps.push(stepsId);
        /** 添加ID TODO: 现在默认添加 */
        tempSchema.forEach((schema) => {
          const { schemaId, code: schemaCode } = schema;
          if ((schemaId as string).indexOf(code) === 0) {
            temp[code].push({ key: `${code}.${schemaCode}`, val: schemaMark + schemaId });
          }
        });
        /** 生成ref2Val */
        const ref2ValId = `${submitId}_${stepsId}`;
        const ref2Val = template(ref2ValId, temp[code]);
        tempRef2Val.push(ref2Val);

        APBDSLItems[stepsId] = {
          stepsId,
          funcCode: FuncCodeOfAPB.C,
          table: code,
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
  const { extralDsl: { tempFlow } } = transfromCtx;
  const { actionType, name, openPage: { link, openType, pageArea, paramMatch } } = actionConf;
  // paramMatch //  变量传值
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
    }
  };
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
      default:
        break;
    }
  }
  return res;
};
