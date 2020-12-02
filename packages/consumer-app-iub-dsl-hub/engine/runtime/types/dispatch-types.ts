// import { PageManageInstance } from "@consumer-app/web-platform/src/page-manage";
import {
  DispatchModuleActionManage, TDispatchMethodNameOfActionManage,
  DispatchModuleCondition, TDispatchMethodNameOfCondition,
  DispatchModuleFlowManage, TDispatchMethodNameOfFlowManage,
  DispatchModuleIUBStore, TDispatchMethodNameOfIUBStore,
  DispatchModuleRelationship, TDispatchMethodNameOfRelationship,
  DispatchModuleSys, TDispatchMethodNameOfSys,
  DispatchModuleMetadata, TDispatchMethodNameOfDatasourceMeta
} from ".";
import { BaseActionInfo } from "../../actions-manage/types";

export interface DispatchCtxOfIUBEngine {
  actionInfo?: BaseActionInfo;
  dispatch: Dispatch;
}

export interface RunTimeCtxToBusiness {
  pageId: string;
  pageMark: string;
  pageStatus: string;
  action?: any;
  pageManage: PageManageInstance;
  asyncDispatchOfIUBEngine: (dispatchCtx: DispatchCtxOfIUBEngine) => Promise<any>;
  dispatchOfIUBEngine: (dispatchCtx: DispatchCtxOfIUBEngine) => any
}

export type Dispatch =
  (
    DispatchModuleActionManage |
    DispatchModuleCondition |
    DispatchModuleFlowManage |
    DispatchModuleIUBStore |
    DispatchModuleRelationship |
    DispatchModuleSys |
    DispatchModuleMetadata
  )
  & { params: any[] };

export const enum DispatchModuleName {
  IUBStore = 'IUBStore',
  metadata = 'metadata',
  sys = 'sys',
  relationship = 'relationship',
  flowManage = 'flowManage',
  actionMenage = 'actionMenage',
  condition = 'condition'
}

export interface IUBEngineRuntimeCtx {
  [DispatchModuleName.IUBStore]: {
    [K in TDispatchMethodNameOfIUBStore]: (...args: any[]) => unknown
  };
  [DispatchModuleName.metadata]: {
    [K in TDispatchMethodNameOfDatasourceMeta]: (...args: any[]) => unknown
  };
  [DispatchModuleName.actionMenage]: {
    [K in TDispatchMethodNameOfActionManage]: (...args: any[]) => unknown
  };
  [DispatchModuleName.relationship]: {
    [K in TDispatchMethodNameOfRelationship]: (...args: any[]) => unknown
  };
}

export interface AsyncIUBEngineRuntimeCtx extends IUBEngineRuntimeCtx {
  [DispatchModuleName.sys]: {
    // [K in TDispatchMethodNameOfSys]: (...args: any[]) => unknown
    [str: string]: (...args: any[]) => unknown;
  };
  [DispatchModuleName.flowManage]: {
    [K in TDispatchMethodNameOfFlowManage]: (...args: any[]) => unknown
  };
  [DispatchModuleName.condition]: {
    [K in TDispatchMethodNameOfCondition]: (...args: any[]) => unknown
  };
}
