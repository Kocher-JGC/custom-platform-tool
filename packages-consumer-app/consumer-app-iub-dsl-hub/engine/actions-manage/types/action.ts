import { AllActionType } from "@iub-dsl/definition/actions/action";
import { RunTimeCtxToBusiness } from "../../runtime/types";

/**
 * 动作解析的结果 「列表]
 */
export interface ActionList {
  [actionId: string]: any; /** AOP, 不知道可以嵌套多少层 */
}

/**
 * IUBParser动作解析后最终结果
 */
export interface ActionParserRes {
  actionIds: string[];
  actionList: ActionList;
  bindAction: (actionID: string) => ActionDoFn
  reSetAction: any;
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
 * 动作解析返回函数的标准 {TODO: 目前的action都是promise}
 */
export interface ActionDoFn {
  (ctx: RunTimeCtxToBusiness): Promise<any> // any: 动作返回标准
}

// experiment 实验性
