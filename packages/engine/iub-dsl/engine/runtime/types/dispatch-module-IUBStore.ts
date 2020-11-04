import { DispatchModuleName } from ".";
import { IUBStoreMethod } from "../../state-manage";

export interface DispatchModuleIUBStore {
  module: DispatchModuleName.IUBStore;
  method: DispatchMethodNameOfIUBStore
}

export type TDispatchMethodNameOfIUBStore = IUBStoreMethod;
// "updatePageState" | "isPageState" | "pickPageStateKeyWord" | "targetUpdateState" | "getPageState" | "getWatchDeps" | "getSchemaMetadata"
export enum DispatchMethodNameOfIUBStore {
  targetUpdateState = 'targetUpdateState',
  updatePageState = 'updatePageState',
  getPageState = 'getPageState',
  isPageState = 'isPageState',
  pickPageStateKeyWord = 'pickPageStateKeyWord',
  getWatchDeps = 'getWatchDeps',
  getSchemaMetadata = 'getSchemaMetadata',
  updatePageStateFromTableRecord = 'updatePageStateFromTableRecord'
}

type A = keyof typeof DispatchMethodNameOfIUBStore;
