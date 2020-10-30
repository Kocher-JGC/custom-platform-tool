import { DispatchModuleName } from ".";

export interface DispatchModuleCondition {
  module: DispatchModuleName.condition;
  method: DispatchMethodNameOfCondition
}

export type TDispatchMethodNameOfCondition = 'ConditionHandleOfAPBDSL'

export enum DispatchMethodNameOfCondition {
  ConditionHandleOfAPBDSL = 'ConditionHandleOfAPBDSL'
}
