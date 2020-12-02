import { DispatchModuleName } from "..";

export interface DispatchModuleMetadata {
  module: DispatchModuleName.metadata;
  method: DispatchMethodNameOfMetadata
}

export type TDispatchMethodNameOfDatasourceMeta = keyof typeof DispatchMethodNameOfMetadata

export const enum DispatchMethodNameOfMetadata {
  getMetaKeyInfo = 'getMetaKeyInfo',
  getFieldKeyInfo = 'getFieldKeyInfo',
  getMetaFieldKey = 'getMetaFieldKey',
  getMetaFromMark = 'getMetaFromMark',
  fieldDataMapToFieldMarkData = 'fieldDataMapToFieldMarkData'
}
