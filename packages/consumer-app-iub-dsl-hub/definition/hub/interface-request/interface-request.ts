import { InterDef } from './interface-def';
/**
 * 接口请求的类型
 */
export const enum InterReqType {
  APBDSL = 'APBDSL',
}

/**
 * 基础的接口请求的定义
 */

export interface BaseInterReqDef {
  interReqType: InterReqType;
  interList: {
    [str: string]: InterDef;
  };
  interStep: string[];
}

/**
 * APBDSL接口请求的定义
 */
export interface InterReqOfAPBDSL extends BaseInterReqDef {
  interReqType: InterReqType.APBDSL;

  /** 单独属于APB的定义 */
  extral?: {
    businessCode?: string;
  }
}

/** 
 * 所有接口请求的定义
 */

export type InterReqDef =  InterReqOfAPBDSL;


export interface InterCollection {
  [interId: string]: InterReqDef;
}

/**
 * 对于IUBDSL, 请求并不属于IUBDSL
 * 收集数据 1
 * 拼装数据 2ref
 * 转换数据 0
 * 发起请求 0
 * 转换数据 0 2
 * 写入数据 1
 */
/**
 * 接口请求的类型
 */


/**
 * 模块职能
 * IUBDSL的扩展, 提供给IUBDSL内部发请求的模块
 * 1. APBDSL请求
 * 2. 三方请求
 * 
 * 1. 请求函数 [返回处理、 错误处理 ] (一种类型一个请求函数)
 * 2. APBDSL转换器「分片转换」
 * 3. IBDSL 依赖 「数据获取函数、条件处理引擎」
 * 4. 分页处理模块、 排序、分组
 */