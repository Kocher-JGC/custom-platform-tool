import { DispatchModuleName } from "..";
import { IUBStoreMethod } from "../../../state-manage/types";

export interface DispatchModuleIUBStore {
  module: DispatchModuleName.IUBStore;
  method: DispatchMethodNameOfIUBStore
}

export type TDispatchMethodNameOfIUBStore = IUBStoreMethod;
export enum DispatchMethodNameOfIUBStore {
  targetUpdateState = 'targetUpdateState',
  mappingUpdateState = 'mappingUpdateState',
  getPageState = 'getPageState',
  isPageState = 'isPageState',
  pickPageStateKeyWord = 'pickPageStateKeyWord',
  getWatchDeps = 'getWatchDeps',
  getSchemaMetadata = 'getSchemaMetadata',
  updatePageStateFromTableRecord = 'updatePageStateFromTableRecord'
}

type A = keyof typeof DispatchMethodNameOfIUBStore;
