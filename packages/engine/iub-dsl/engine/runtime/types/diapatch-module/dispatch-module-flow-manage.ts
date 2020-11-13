import { DispatchModuleName } from "..";

export interface DispatchModuleFlowManage {
  module: DispatchModuleName.flowManage;
  method: DispatchMethodNameOfFlowManage
}

export type TDispatchMethodNameOfFlowManage = keyof typeof DispatchMethodNameOfFlowManage

export enum DispatchMethodNameOfFlowManage {
  flowsRun = 'flowsRun'
}
