import {
  ApbFunction, APBDSLCURDOptions, EnumCURD, NormalCURD,
  TableInsert, TableUpdate, TableSelect, TableDelete
} from "@iub-dsl/definition/actions";
import { Condition, ConditionOperator } from "@iub-dsl/definition";
import { dataCollectionAction } from "../sys-actions";
import {
  getGenAPBDSLFunctionTransform, SelectParamOfAPBDSL, UpdateParamOfAPBDSL, DelParamOfAPBDSL
} from "./APBDSL";
import { arrayAsyncHandle } from "../../utils";
import { ActionDoFn } from "../types";
import {
  DispatchCtxOfIUBEngine,
  DispatchModuleName,
  DispatchMethodNameOfMetadata,
  DispatchMethodNameOfSys,
  DispatchMethodNameOfCondition,
  RunTimeCtxToBusiness
} from "../../runtime/types";

const getActualTable = (dispatchOfIUBEngine: (ctx: DispatchCtxOfIUBEngine) => string, table) => {
  return dispatchOfIUBEngine({
    dispatch: {
      module: DispatchModuleName.metadata,
      method: DispatchMethodNameOfMetadata.getMetaKeyInfo,
      params: [table]
    }
  });
};

const getAPBDSLCond = async (asyncDispatchOfIUBEngine: (ctx: DispatchCtxOfIUBEngine) => any, condition) => {
  return condition ? await asyncDispatchOfIUBEngine({
    dispatch: {
      module: DispatchModuleName.condition,
      method: DispatchMethodNameOfCondition.ConditionHandleOfAPBDSL,
      params: [condition],
    }
  }) : {};
};

const defalutCond: (id: string) => Condition = (id) => ({
  conditionControl: {
    and: ['cond1']
  },
  conditionList: {
    cond1: {
      operator: ConditionOperator.EQU,
      exp1: 'id',
      exp2: id
    }
  }
});

const normalCURDActionParseScheduler = (action: NormalCURD) => {
  // const { type: CURDType, table } = action;
  switch (action.type) {
    case EnumCURD.TableInsert:
      return genTableInsertFn(action);
    case EnumCURD.TableUpdate:
      return genTableUpdatetFn(action);
    case EnumCURD.TableSelect:
      return genTableSelectFn(action);
    case EnumCURD.TableDelete:
      return genTableDeleteFn(action);
    default:
      console.error('为获取到对应动作的处理');
      return () => {};
  }
};

const genTableInsertFn = (actionConf: TableInsert): ActionDoFn => {
  const { fieldMapping, table } = actionConf;
  const getFiled = dataCollectionAction(fieldMapping);
  return async (ctx) => {
    const { dispatchOfIUBEngine } = ctx;
    /** 组装请求参数 */
    const insertParam = {
      set: await getFiled(ctx),
      table: getActualTable(dispatchOfIUBEngine, table)
    };

    /** 获取set转换函数 */
    const getSetOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.SET);
    const APBDSLItem = getSetOfAPBDSL(insertParam);
    return APBDSLItem;
  };
};

const genTableUpdatetFn = (actionConf: TableUpdate): ActionDoFn => {
  const { fieldMapping, table, condition } = actionConf;
  const getFiled = dataCollectionAction(fieldMapping);
  return async (ctx) => {
    const { dispatchOfIUBEngine, asyncDispatchOfIUBEngine } = ctx;
    // const actualTable = ;
    /** 组装请求参数 */
    const updateParam: UpdateParamOfAPBDSL = {
      table: getActualTable(dispatchOfIUBEngine, table),
      condition: await getAPBDSLCond(asyncDispatchOfIUBEngine, condition),
      set: await getFiled(ctx),
    };

    /** 获取upd转换函数 */
    const getUpdOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.UPD);
    const APBDSLItem = getUpdOfAPBDSL(updateParam);
    return APBDSLItem;
  };
};

const genTableSelectFn = (actionConf: TableSelect): ActionDoFn => {
  const { table, condition } = actionConf;
  return async (ctx) => {
    const { dispatchOfIUBEngine, asyncDispatchOfIUBEngine } = ctx;
    /** 获取set转换函数 */
    const selectParam: SelectParamOfAPBDSL = {
      table: getActualTable(dispatchOfIUBEngine, table),
      condition: await getAPBDSLCond(asyncDispatchOfIUBEngine, condition),
    };
    ctx.search = true;
    const getSelectOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.SELECT);
    const APBDSLItem = getSelectOfAPBDSL(selectParam);
    return APBDSLItem;
  };
};

const genTableDeleteFn = (actionConf: TableDelete): ActionDoFn => {
  const { table, condition } = actionConf;
  return async ({ action, asyncDispatchOfIUBEngine, dispatchOfIUBEngine }) => {
    console.log(action);
    /** 临时 */
    const { payload: { schemasPatch, table: { gridData: { id } } }, } = action;

    /** 获取set转换函数 */
    const getDelOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.DEL);
    /** 组装请求参数 */
    const delParam: DelParamOfAPBDSL = {
      table: getActualTable(dispatchOfIUBEngine, schemasPatch),
      condition: await getAPBDSLCond(asyncDispatchOfIUBEngine, defalutCond(id)),
    };

    const APBDSLItem = getDelOfAPBDSL(delParam);
    return APBDSLItem;
  };
};

/** 递归调用生成steps */
const APBDSLStepsFnRun = async (originFns, runtimeCtx) => {
  const result = arrayAsyncHandle(originFns, {
    handle: async (fn) => await fn(runtimeCtx)
  });

  return result;
};

/**
 * APBDSL的CURD动作
 * @param conf APBDSL动作
 */
export const APBDSLCURDAction = (conf: APBDSLCURDOptions, baseActionInfo): ActionDoFn => {
  const { actionList, actionStep, businesscode } = conf;
  const APBActionIds = Object.keys(actionList);

  const steps: any[] = [];
  const APBDSL = {
    businesscode,
    steps
  };
  APBActionIds.forEach((id) => {
    const fn = normalCURDActionParseScheduler(actionList[id]);
    steps.push(fn);
  });

  return async (runtimeCtx: RunTimeCtxToBusiness) => {
    const action = {
      actionType: 'APBDSLCURDAction',
      businesscode
    };
    /** 生成很多函数? */
    APBDSL.steps = await APBDSLStepsFnRun(steps, runtimeCtx);
    return await runtimeCtx?.asyncDispatchOfIUBEngine({
      actionInfo: {
        ...baseActionInfo,
        ...action
      },
      dispatch: {
        module: DispatchModuleName.sys,
        method: DispatchMethodNameOfSys.APBDSLrequest,
        params: [APBDSL, runtimeCtx.search],
      }
    });
  };
};
