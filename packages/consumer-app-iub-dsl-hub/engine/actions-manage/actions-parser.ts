import { ActionDef, ActionCollection } from "@iub-dsl/definition/actions/action";
import { openModelFromTable } from './sys-actions/modal/modal-show-from-table';
import { changeStateAction, openModal } from "./sys-actions";
import { APBDSLCURDAction } from "./business-actions";

import { ActionParserRes } from "./types";
import { pickActionMark } from "../IUBDSL-mark";
import { RunTimeCtxToBusiness } from "../runtime/types";
import { noopError, reSetFuncWrap } from "../utils";
import { defaultExtralParser } from "../IUBDSLParser";

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
  const bindAction = (actionId: string) => {
    /** 预留: 非actionId, 绑定时候可以做额外的判断或处理 */
    actionId = pickActionMark(actionId);

    /**
     * 最后一层包装函数
     */
    return (context: RunTimeCtxToBusiness) => { 
      let actionRunFn = actionList[actionId];
      
      if (typeof actionRunFn !== 'function') {
        console.error(`获取流程失败!: ${actionId}`);
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
      return openModal;
    case 'interfaceRequest':
      return () => noopError;
    case 'APBDSLCURD':
      return APBDSLCURDAction;
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