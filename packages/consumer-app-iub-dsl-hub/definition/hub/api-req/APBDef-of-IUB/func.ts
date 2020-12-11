import { FuncCodeOfAPB, BaseAPBDef } from "../api-req-of-APB";

/**
 * APBDSL 特殊函数 的定义
 */


/**
 * 生成ID的函数功能码
 */
export interface IdOfFuncCode extends BaseAPBDef {
  funcCode: FuncCodeOfAPB.ID;
}

/**
 * 获取当前时间的的函数功能码
 */
export interface NowOfFuncCode extends BaseAPBDef{
  funcCode: FuncCodeOfAPB.Now;
}

/**
 * 获取系统用户信息的的函数功能码
 */
export interface SysUserOfFuncCode extends BaseAPBDef{
  funcCode: FuncCodeOfAPB.SysUser;
}

/**
 * 自定义结果集的函数功能码
 */

export interface ResResolveOfFuncCode extends BaseAPBDef {
  funcCode: FuncCodeOfAPB.ResResolve;
  resolver: { [str: string]: any }
}