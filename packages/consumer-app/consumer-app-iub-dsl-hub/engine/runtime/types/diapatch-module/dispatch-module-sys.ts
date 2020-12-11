import { DispatchModuleName } from "..";

export interface DispatchModuleSys {
  module: DispatchModuleName.sys;
  method: DispatchMethodNameOfSys | string
}

export type TDispatchMethodNameOfSys = keyof typeof DispatchMethodNameOfSys

export const enum DispatchMethodNameOfSys {
  APBDSLrequest = 'APBDSLrequest',
}
