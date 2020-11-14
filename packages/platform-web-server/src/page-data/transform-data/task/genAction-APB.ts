import { genEquCond } from "../utils";
import { genDefalutFlow, DEFALUT_FLOW_MARK } from "./flow";
import { TransfromCtx } from "../types";

/**  TODO: 临时的生成schema和condition的函数 */
const getDataCollectionFromSchema = (schema) => {
  const collectStruct = [];
  const schemaIds = Object.keys(schema);
  
  let condition;

  schemaIds.forEach(id => {
    if (schema[id].isPk) {
      condition = genEquCond(schema[id].fieldMapping, `@(schema).${schema[id].schemaId}`);
    }
    collectStruct.push({
      field: `${schema[id].fieldMapping}`,
      collectField: `@(schema).${id}`,
    });
  });
  return { collectStruct, condition };
};

export const genAPBDSLAction =(transfromCtx: TransfromCtx, actionId: string, actionConf, pageSchema) => {
  const {
    action:{
      actionName,  actionType, forEntrieTable, targetTable
    },
    // condition, event, preTrigger, triggerAction
  } = actionConf;

  const {  extralDsl: { tempFlow } } = transfromCtx;

  /** 临时的生成函数, CUD */
  const { collectStruct, condition } = getDataCollectionFromSchema(pageSchema) || { collectStruct: [], condition: { conditionControl: {}, conditionList: {} } };

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
    tempFlow.push(data);
  });
  tempFlow.push({
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
};