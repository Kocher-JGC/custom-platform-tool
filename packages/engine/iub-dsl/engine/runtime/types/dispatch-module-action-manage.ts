import { DispatchModuleName } from ".";

export interface DispatchModuleActionManage {
  module: DispatchModuleName.actionMenage;
  method: DispatchMethodNameOfActionManage
}

export type TDispatchMethodNameOfActionManage = 'string'

export enum DispatchMethodNameOfActionManage {
}
