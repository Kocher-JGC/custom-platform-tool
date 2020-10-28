import { DispatchModuleName } from ".";

export interface DispatchModuleSys {
  module: DispatchModuleName.sys;
  method: DispatchMethodNameOfSys | string
}

export type TDispatchMethodNameOfSys =
  'APBDSLrequest';

export enum DispatchMethodNameOfSys {
  APBDSLrequest = 'APBDSLrequest',
}
