import { CreateDef, UpdateDef, ReadDef, DeleteDef, IdOfFuncCode, NowOfFuncCode, SysUserOfFuncCode, ResResolveOfFuncCode } from './APBDef-of-IUB';
import { APIReqType } from "./api-req";

/**
 * APBDSL的所有函数功能码
 */
export const enum FuncCodeOfAPB {
  /** 普通 */
  C = 'TABLE_INSERT',
  U = 'TABLE_UPDATE',
  R = 'TABLE_SELECT',
  D = 'TABLE_DELETE',
  /** 特殊功能码 */
  ResResolve = 'RESULT_RESOLVER',
  /** 函数功能码 */
  ID = 'ID',
  SysUser = 'SYSTEM_USER',
  Now = 'NOW',
}

/**
 * 基础得APBDSL定义
 */
export interface BaseAPBDef {
  stepsId: string;
  funcCode: FuncCodeOfAPB;
  // table: string;
}

/**
 * APBDSL 在 IUB中的定义
 */
export type APBDefOfIUB = 
  CreateDef | UpdateDef | ReadDef | DeleteDef |
  IdOfFuncCode | NowOfFuncCode | SysUserOfFuncCode | ResResolveOfFuncCode

/**
 * 按照步骤定义请求的通用结构
 */
interface BaseStepAPIReqDef {

  list: {
    [listId: string]: APBDefOfIUB;
  };
  steps: string[];
}

/**
 * APBDSL请求的定义
 */
export interface APBDSLReq extends BaseStepAPIReqDef {
  reqType: APIReqType.APBDSL;
  businessCode?: string;
}