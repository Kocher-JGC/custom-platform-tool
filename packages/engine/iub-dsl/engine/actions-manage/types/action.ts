import { AllActionType } from "@iub-dsl/definition/actions/action";
import { RunTimeCtxToBusiness } from "../../runtime/types";

/**
 * 动作解析扩展的信息
 * experiment 实验性
 */
export interface ExtralActionParseRes {
  // actionConf, // ! 尽量不要暴露, 因为actionConf会不安全
  changeStateToUse: string[];
  getStateToUse: string[];
}

/**
 * 基础动作解析返回的信息
 */
export interface BaseActionInfoParseRes {
  actionHandle: any; // Func
}

/**
 * 动作解析的结果
 */
export type ActionInfoParseRes = BaseActionInfoParseRes & ExtralActionParseRes

/**
 * 动作解析的结果 「列表]
 */
export interface ActionInfoListParseRes {
  [actionId: string]: ActionInfoParseRes
}

/**
 * IUBParser动作解析后最终结果
 */
export interface ActionParserRes {
  actionIds: string[];
  actionParseRes: ActionInfoListParseRes;
  getActionParseRes: (actionID: string) => ActionInfoParseRes
}

/**
 * 调度上下文的基础动作信息
 */
export interface BaseActionInfo {
  actionId: string;
  actionName: string;
  actionType: AllActionType | string;
}

/**
 * 动作解析返回函数的标准
 */
export interface ActionDoFn {
  (ctx: RunTimeCtxToBusiness): Promise<any> // any: 动作返回标准
}
