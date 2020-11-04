import { DispatchModuleName } from ".";

export interface DispatchModuleCondition {
  module: DispatchModuleName.condition;
  method: DispatchMethodNameOfCondition
}

export type TDispatchMethodNameOfCondition = keyof typeof DispatchMethodNameOfCondition

export enum DispatchMethodNameOfCondition {
  ConditionHandleOfAPBDSL = 'ConditionHandleOfAPBDSL',
  ConditionHandle = 'ConditionHandle'
}
