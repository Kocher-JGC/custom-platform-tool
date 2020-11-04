import { DispatchModuleName } from ".";

export interface DispatchModuleDatasourceMeta {
  module: DispatchModuleName.datasourceMeta;
  method: DispatchMethodNameOfDatasourceMeta
}

export type TDispatchMethodNameOfDatasourceMeta = keyof typeof DispatchMethodNameOfDatasourceMeta

export enum DispatchMethodNameOfDatasourceMeta {
  getTable = 'getTable',
  getFiledCode = 'getFiledCode',
  getFiledsCodeFromTable = 'getFiledsCodeFromTable',
  getMetadata = 'getMetadata',
  fieldCodeMapToFieldMark = 'fieldCodeMapToFieldMark'
}
