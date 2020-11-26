import { ActionDef, ActionCollection } from "@iub-dsl/definition/actions/action";
import { openModelFromTable } from './sys-actions/modal/modal-show-from-table';

import { updateStateAction, dataCollectionAction, openModal } from "./sys-actions";
import { APBDSLCURDAction } from "./business-actions";

import {
  ExtralActionParseRes, ActionParserRes, ActionInfoParseRes
} from "./types";
import { pickActionMark } from "../IUBDSL-mark";

const getExtralActionParserRes = (): ExtralActionParseRes => ({ changeStateToUse: [], getStateToUse: [] });

const noop = () => {};

/**
 * 动作集合解析器
 * @param actionCollection 动作集合
 * @param parsrContext 解析上下文 TODO:
 */
export const actionsCollectionParser = (
  actionCollection: ActionCollection,
  parsrContext
): ActionParserRes => {
  const actionParseRes = {};
  const actionIds = Object.keys(actionCollection);
  const { actionDependCollect } = parsrContext;
  actionIds.forEach((key) => {
    /** TODO: 待修改 */
    if (actionDependCollect) {
      actionDependCollect(key, actionCollection[key]);
    }
    actionParseRes[key] = {
      /** 原始逻辑必要的 */
      actionHandle: getActionFn(actionCollection[key]),
      /** 额外逻辑, 充分的 TODO: 终究对逻辑有侵入 */
      ...commonActionConfParser(
        actionCollection[key],
        getExtralActionParserRes(),
        parsrContext
      )
    };
  });

  /** 对外暴露获取的函数 */
  const getActionParseRes = (actionID: string): ActionInfoParseRes => {
    actionID = pickActionMark(actionID);
    if (actionID === '') {
      return {
        actionHandle: noop,
        changeStateToUse: [],
        getStateToUse: []
      };
    }
    if (actionIds.includes(actionID)) {
      return actionParseRes[actionID];
    }
    return {
      actionHandle: () => { console.error('未获取Actions'); },
      changeStateToUse: [],
      getStateToUse: []
    };
  };

  return {
    actionParseRes,
    actionIds,
    getActionParseRes
  };
};

/** TODO: 待修改 */
const commonActionConfParser = (
  actionConf,
  actionConfParseRes: ExtralActionParseRes,
  parsrContext
): ExtralActionParseRes => {
  const { actionConfParser } = parsrContext;

  if (actionConfParser) {
    return actionConfParser(actionConf, actionConfParseRes, parsrContext);
  }

  return actionConfParseRes;
};

/** 生成动作的基本信息 */
const genBaseActionInfo = (conf: ActionDef) => ({ actionId: conf.actionId, actionName: conf.actionName, actionType: conf.actionType });

/**
 * 动作包装器
 * @description 包装挟持. 1.处理when、condition以确定动作是否可以被执行
 * @param conf 原始动作配置
 * @param originFn 原始生成实际运行动作的函数
 */
const actionWrapFn = (conf: ActionDef, originFn) => {
  const baseActionInfo = genBaseActionInfo(conf);
  const { when, condition, actionOptions } = conf;
  const extralConf = {
    ...baseActionInfo
  };
  return originFn(actionOptions, extralConf);
};

/**
 * 根据动作类型,获取动作处理函数并返回可以运行的动作函数
 * @param actionConf 动作配置
 */
const getActionFn = (actionConf: ActionDef) => {
  switch (actionConf.actionType) {
    case 'updateState':
      return actionWrapFn(actionConf, updateStateAction);
    case 'dataCollection':
      return actionWrapFn(actionConf, dataCollectionAction);
    case 'APBDSLCURD':
      return actionWrapFn(actionConf, APBDSLCURDAction);
    case 'openModal':
      return actionWrapFn(actionConf, openModal);
    case 'openModalFromTableClick':
      return actionWrapFn(actionConf, openModelFromTable);
    default:
      if (typeof actionConf === 'function') {
        return actionConf;
      }
      console.error('err action');
      return () => {};
  }
};
