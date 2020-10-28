import { DispatchModuleName } from ".";

export interface DispatchModuleSys {
  module: DispatchModuleName.sys;
  method: DispatchMethodNameOfSys
}

export type TDispatchMethodNameOfSys =
  'APBDSLrequest';

export enum DispatchMethodNameOfSys {
  APBDSLrequest = 'APBDSLrequest',
}
