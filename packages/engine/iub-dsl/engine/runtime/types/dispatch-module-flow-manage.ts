import { DispatchModuleName } from ".";

export interface DispatchModuleFlowManage {
  module: DispatchModuleName.flowManage;
  method: DispatchMethodNameOfFlowManage
}

export type TDispatchMethodNameOfFlowManage =
  'flowsRun';

export enum DispatchMethodNameOfFlowManage {
  flowsRun = 'flowsRun'
}
