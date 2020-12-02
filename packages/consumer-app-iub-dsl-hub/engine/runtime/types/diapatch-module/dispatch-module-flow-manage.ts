import { DispatchModuleName } from "..";

export interface DispatchModuleFlowManage {
  module: DispatchModuleName.flowManage;
  method: DispatchMethodNameOfFlowManage
}

export type TDispatchMethodNameOfFlowManage = keyof typeof DispatchMethodNameOfFlowManage

export const enum DispatchMethodNameOfFlowManage {
  flowsRun = 'flowsRun'
}
