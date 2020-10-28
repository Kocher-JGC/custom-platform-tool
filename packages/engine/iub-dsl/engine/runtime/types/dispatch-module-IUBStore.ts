import { DispatchModuleName } from ".";

export interface DispatchModuleIUBStore {
  module: DispatchModuleName.IUBStore;
  method: DispatchMethodNameOfIUBStore
}

export type TDispatchMethodNameOfIUBStore =
  'targetUpdateState' |
  'updatePageState' |
  'getPageState' |
  'getWatchDeps';
export enum DispatchMethodNameOfIUBStore {
  targetUpdateState = 'targetUpdateState',
  updatePageState = 'updatePageState',
  getPageState = 'getPageState',
  getWatchDeps = 'getWatchDeps',
}
