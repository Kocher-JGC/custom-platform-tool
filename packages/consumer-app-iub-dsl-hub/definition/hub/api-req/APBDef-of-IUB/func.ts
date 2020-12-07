import { FuncCodeOfAPB } from "../api-req-of-APB";

/**
 * APBDSL 特殊函数 的定义
 */


/**
 * 生成ID的函数功能码
 */
export interface IdOfFuncCode {
  funcCode: FuncCodeOfAPB.ID;
}

/**
 * 获取当前时间的的函数功能码
 */
export interface NowOfFuncCode {
  funcCode: FuncCodeOfAPB.Now;
}

/**
 * 获取系统用户信息的的函数功能码
 */
export interface SysUserOfFuncCode {
  funcCode: FuncCodeOfAPB.SysUser;
}

/**
 * 自定义结果集的函数功能码
 */

export interface ResResolveOfFuncCode {
  funcCode: FuncCodeOfAPB.ResResolve;
}