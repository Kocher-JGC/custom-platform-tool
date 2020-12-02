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

interface APIRes {
  reqType: '',

}