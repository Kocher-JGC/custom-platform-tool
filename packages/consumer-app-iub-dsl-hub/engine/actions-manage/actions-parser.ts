import { ActionDef, ActionCollection } from "@iub-dsl/definition";
import { changeStateAction, openPageAction } from "./sys-actions";
import { ActionParserRes } from "./types";
import { pickActionMark, isAction } from "../IUBDSL-mark";
import { RunTimeCtxToBusiness } from "../runtime/types";
import { noopError, reSetFuncWrap, noopBind } from "../utils";
import { defaultExtralParser } from "../IUBDSLParser";
import { APIReqAction } from "./business-actions/API-req";

/**
 * 动作集合解析器
 * @param actionCollection 动作集合
 */
export const actionsCollectionParser = (
  actionCollection: ActionCollection
): ActionParserRes => {
  const actionList = {};
  const actionIds = Object.keys(actionCollection);
  actionIds.forEach((key) => {
    const actionFn = getActionFn(actionCollection[key]);
    actionList[key] = actionParseWrapFn(actionCollection[key], actionFn);
  });

  /**
   * 绑定真实处理动作的函数
   * @param actionId 动作id
   */
  const bindAction = (actionId: string, plugins?) => {
    /** 非@(action).标示 */
    if (!isAction(actionId) && actionId !== '') {
      return noopBind(actionId);
    }
    /** 预留: 非actionId, 绑定时候可以做额外的判断或处理 */
    actionId = pickActionMark(actionId);

    /**
     * 最后一层包装函数
     */
    return (context: RunTimeCtxToBusiness) => {
      if (!actionId) {
        return (IUBCtx) => { };
      }
      let actionRunFn = actionList[actionId];
      if (typeof actionRunFn !== 'function') {
        console.error(`获取动作失败!: ${actionId}`);
        actionRunFn = noopError;
      }
      
      return actionRunFn(context);
    };
  };

  const reSetAction = reSetFuncWrap(actionIds, actionList);

  return {
    actionList,
    actionIds,
    bindAction,
    reSetAction
  };
};

/**
 * 动作解析包装器
 * @description 包装挟持. 1.处理when、condition以确定动作是否可以被执行
 * @param conf 原始动作配置
 * @param originFn 原始生成实际运行动作的函数
 */
const actionParseWrapFn = (conf: ActionDef, actionFn) => {
  const actionBaseConf = genActionBaseInfo(conf);
  /** 扩展的动作解析 */
  return (actionExtralParser = defaultExtralParser) => {
    /**
     * originFn: 原始处理函数
     * actOpts: 动作配置
     * actConf: 基础的动作配置信息
     */
    const { actionFn: fn, actionOpts, actionBaseConf: confToUse } = actionExtralParser({ actionFn, actionOpts: conf.actionOptions, actionBaseConf });

    const runFn = fn(actionOpts, confToUse);
    return runFn;
  };
};


/**
 * 根据动作类型,获取动作处理函数并返回可以运行的动作函数
 * @param actionConf 动作配置
 */
const getActionFn = (actionConf: ActionDef) => {
  switch (actionConf.actionType) {
    case 'changeState':
      return changeStateAction;
    case 'openPage':
      return openPageAction;
    case 'APIReq':
      return APIReqAction;
    // case 'openModalFromTableClick':
    //   return actionParseWrapFn(actionConf, openModelFromTable);
    default:
      if (typeof actionConf === 'function') {
        return actionConf;
      }
      // console.error(`未知动作类型！：${JSON.stringify(actionConf)}`);
      return () => noopError;
  }
};

/**
 * 生成动作的基本信息
 */
const genActionBaseInfo = (conf: ActionDef) => ({ actionId: conf.actionId, actionName: conf.actionName, actionType: conf.actionType });