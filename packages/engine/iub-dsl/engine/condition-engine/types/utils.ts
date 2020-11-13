import { ConditionDescriptionInfo, ConditionOperator } from "@iub-dsl/definition";

/** 规范化的条件信息 */
export interface normalCondParam {
  operator: ConditionOperator;
  expsValue: ConditionDescriptionInfo[]
}
/** 规范化的条件列表信息 */
export interface normalCondListParam {
  [condId: string]: normalCondParam
}
