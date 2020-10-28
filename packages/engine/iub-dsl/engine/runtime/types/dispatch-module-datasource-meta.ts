import { DispatchModuleName } from ".";

export interface DispatchModuleDatasourceMeta {
  module: DispatchModuleName.datasourceMeta;
  method: DispatchMethodNameOfDatasourceMeta
}

export type TDispatchMethodNameOfDatasourceMeta =
  'getTable' |
  'getFiledCode' |
  'getFiledsCodeFromTable';

export enum DispatchMethodNameOfDatasourceMeta {
  getTable = 'getTable',
  getFiledCode = 'getFiledCode',
  getFiledsCodeFromTable = 'getFiledsCodeFromTable'
}
