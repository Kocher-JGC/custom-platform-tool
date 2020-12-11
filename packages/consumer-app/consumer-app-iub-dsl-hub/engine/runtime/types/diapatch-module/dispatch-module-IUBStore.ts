import { DispatchModuleName } from "..";
import { IUBStoreMethod } from "../../../state-manage/types";

export interface DispatchModuleIUBStore {
  module: DispatchModuleName.IUBStore;
  method: DispatchMethodNameOfIUBStore
}

export type TDispatchMethodNameOfIUBStore = IUBStoreMethod;
export const enum DispatchMethodNameOfIUBStore {
  targetUpdateState = 'targetUpdateState',
  mappingUpdateState = 'mappingUpdateState',
  getPageState = 'getPageState',
  getWatchDeps = 'getWatchDeps',
  getSchemaMetadata = 'getSchemaMetadata',
  updatePageStateFromTableRecord = 'updatePageStateFromTableRecord'
}

// type A = keyof typeof DispatchMethodNameOfIUBStore;
