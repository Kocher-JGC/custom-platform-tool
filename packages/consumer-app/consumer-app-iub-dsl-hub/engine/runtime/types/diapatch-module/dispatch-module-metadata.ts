import { InterMetaEntity } from '@iub-dsl/engine/inter-meta-manage';
import { DispatchModuleName } from "..";

export interface DispatchModuleMetadata {
  module: DispatchModuleName.metadata;
  method: DispatchMethodNameOfMetadata
}

export type TDispatchMethodNameOfDatasourceMeta = keyof InterMetaEntity

export const enum DispatchMethodNameOfMetadata {
  getMetaKeyInfo = 'getMetaKeyInfo',
  getFieldKeyInfo = 'getFieldKeyInfo',
  getMetaFromMark = 'getMetaFromMark',
  fieldDataMapToFieldMarkData = 'fieldDataMapToFieldMarkData',
  /** new */
  findRefRelation = 'findRefRelation',
  id2Code = 'id2Code',
  code2Id = 'code2Id',
  getInterFieldMark = 'getInterFieldMark',
  getInterMeta = 'getInterMeta',
  addInter = 'addInter',
}
