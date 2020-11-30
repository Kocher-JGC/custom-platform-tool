import { ConditionSymbol, ConditionOperator } from "./condition-symbol";
import { Lowcode } from "../low-code";
import { WhenStruct } from "../../public/when";

export type ConditionDescriptionInfo = string | Lowcode;

/** exp为表达式的意思: 对应原型每个格子 */
export interface ConditionItemInfo {
  operator: ConditionOperator;
  exp1: ConditionDescriptionInfo;
  exp2?: ConditionDescriptionInfo;
  exp3?: ConditionDescriptionInfo;
  exp4?: ConditionDescriptionInfo;
  exp5?: ConditionDescriptionInfo;
  // [exp: string]: ConditionDescriptionInfo;
}
/** 对应条件配置中: 每一条的条件配置 */
export interface ConditionList {
  [condId: string]: ConditionItemInfo
}

/** 对应条件配置中: 条件公式 */
export type ConditionControl = {
  [condSymbol in ConditionSymbol]?: (string | ConditionControl)[];
};


export interface Condition {
  conditionList: ConditionList;
  conditionControl: ConditionControl;
}

/** 条件配置的引用 */
export type CommonConditionRef = string;

export interface CommonCondition {
  condition?: Condition;
  when?: WhenStruct;
}

export interface ConditionCollection {
  [condId: string]: CommonCondition;
}