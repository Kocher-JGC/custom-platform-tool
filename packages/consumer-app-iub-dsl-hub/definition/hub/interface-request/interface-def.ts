import { CommonConditionRef, Ref2ValueOfArr } from "../../hub";

export enum InterType {
  C = 'C',
  U = 'U',
  R = 'R',
  D = 'D',
}

// export type SetStruct = {
//   key: string;
//   value: string;
// }[];

/**
 * 接口请求的set描述, 因为struct使用的是ref, 所以未使用
 */
type SetStruct = Ref2ValueOfArr;

interface BaseInterDef {
  interType: InterType;
  inter: string;
}

export interface CInterDef extends BaseInterDef {
  interType: InterType.C;
  set: string;
}

export interface UInterDef extends BaseInterDef {
  interType: InterType.U;
  set: string;
  condition: CommonConditionRef;
}

enum CountFn {
  count = 'count()',
  sum = 'sum()',
  avg = 'avg()',
  max = 'max()',
  min = 'min()',
}

export interface RInterDef extends BaseInterDef {
  interType: InterType.R;
  condition?: CommonConditionRef;
  page?: {
    from: number;
    size: number;
  };
  needTotal?: boolean;
  /** 字段映射信息 */
  fields?: {
    fieldName: string | CountFn;
    mid: string;
  }[];
  sort?: { [str: string]: 'desc' | 'asc'; };
  group?: {
    havingCondition: CommonConditionRef;
    groupBy: string[];
  }
}

export interface DInterDef extends BaseInterDef {
  interType: InterType.D;
  condition: CommonConditionRef;
}

export type InterDef = CInterDef | UInterDef | RInterDef | DInterDef; 
