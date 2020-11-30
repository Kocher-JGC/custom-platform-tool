import { InterDef } from './interface-def';
/**
 * 接口请求的类型
 */
export enum InterReqType {
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