import {
  ApbFunction, APBDSLCURD, EnumCURD, NormalCURD,
  TableInsert, TableUpdate, TableSelect, TableDelete
} from "@iub-dsl/definition/actions";
import { dataCollectionAction } from "../sys-actions";
import { getGenAPBDSLFunctionTransform, SelectParamOfAPBDSL } from "./APBDSL";
import { arrayAsyncHandle } from "../../utils";
import { ActionDoFn } from "../types";
import {
  DispatchCtxOfIUBEngine,
  DispatchModuleName,
  DispatchMethodNameOfDatasourceMeta,
  DispatchMethodNameOfSys,
  DispatchMethodNameOfCondition,
  RunTimeCtxToBusiness
} from "../../runtime/types";

const getActualTable = (dispatchOfIUBEngine: (ctx: DispatchCtxOfIUBEngine) => string, table) => {
  return dispatchOfIUBEngine({
    dispatch: {
      module: DispatchModuleName.datasourceMeta,
      method: DispatchMethodNameOfDatasourceMeta.getTable,
      params: [table]
    }
  });
};

const normalCURDActionParseScheduler = (action: NormalCURD) => {
  const { type: CURDType, table } = action;
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
    /** 获取插入参数 */
    const set = await getFiled(ctx);
    /** 获取set转换函数 */
    const getSetOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.SET);
    /** 转换 */
    const actualTable = getActualTable(dispatchOfIUBEngine, table);
    // const tempSet = Array.isArray(set) ? set.map((_) => ({ ..._, ...tempField })) : [{ ...set, ...tempField }];
    const APBDSLItem = getSetOfAPBDSL({ set, table: actualTable });
    return APBDSLItem;
  };
};

const genTableUpdatetFn = (actionConf: TableUpdate): ActionDoFn => {
  const { fieldMapping, table } = actionConf;
  const getFiled = dataCollectionAction(fieldMapping);
  return async (ctx) => {
    const { dispatchOfIUBEngine } = ctx;
    /** 获取插入参数 */
    const set = await getFiled(ctx);
    /** 获取upd转换函数 */
    const getUpdOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.UPD);
    /** 转换 */
    const actualTable = getActualTable(dispatchOfIUBEngine, table);
    const APBDSLItem = getUpdOfAPBDSL({ set, table: actualTable, condition: {} });
    return APBDSLItem;
  };
};

const genTableSelectFn = (actionConf: TableSelect): ActionDoFn => {
  const { table, condition } = actionConf;
  return async (ctx) => {
    const { dispatchOfIUBEngine, asyncDispatchOfIUBEngine } = ctx;
    /** 获取set转换函数 */
    const getSelectOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.SELECT);
    const actualTable = getActualTable(dispatchOfIUBEngine, table);
    const selectParam: SelectParamOfAPBDSL = {
      table: actualTable,
    };
    if (condition) {
      selectParam.condition = await asyncDispatchOfIUBEngine({
        dispatch: {
          module: DispatchModuleName.condition,
          method: DispatchMethodNameOfCondition.ConditionHandleOfAPBDSL,
          params: [condition],
        }
      });
    }
    /** 转换 */
    const APBDSLItem = getSelectOfAPBDSL(selectParam);
    return APBDSLItem;
  };
};

const genTableDeleteFn = (actionConf: TableDelete): ActionDoFn => {
  const { table } = actionConf;
  return async ({ action, asyncDispatchOfIUBEngine, dispatchOfIUBEngine }) => {
    /** 获取set转换函数 */
    const getDelOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.DEL);
    /** 转换 */
    const actualTable = dispatchOfIUBEngine({
      dispatch: {
        module: DispatchModuleName.datasourceMeta,
        method: DispatchMethodNameOfDatasourceMeta.getTable,
        params: [table]
      }
    });
    const APBDSLItem = getDelOfAPBDSL({ table: actualTable, condition: {} });
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
export const APBDSLCURDAction = (conf: APBDSLCURD, baseActionInfo): ActionDoFn => {
  const {
    actionId,
    actionOptions: { actionList, actionStep, businesscode }
  } = conf;
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
      businesscode,
      actionId
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
        params: [APBDSL],
      }
    });
  };
};
