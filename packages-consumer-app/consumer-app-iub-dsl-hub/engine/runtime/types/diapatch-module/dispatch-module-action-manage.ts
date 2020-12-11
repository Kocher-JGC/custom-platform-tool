import { DispatchModuleName } from "..";

export interface DispatchModuleActionManage {
  module: DispatchModuleName.actionMenage;
  method: DispatchMethodNameOfActionManage
}

export type TDispatchMethodNameOfActionManage = keyof typeof DispatchMethodNameOfActionManage

export const enum DispatchMethodNameOfActionManage {
}
