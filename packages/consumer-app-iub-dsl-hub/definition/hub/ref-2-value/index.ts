import { ComplexType } from "../../schema";


/**
 * 有keyValue的映射结构
 */
export interface TransfMapping {
  key: Ref2ValueOfFoundation; // 需要转换
  // value: string; // 先支持一层的
  value: Ref2Value; // 映射关系的应该支持递归
}

/**
 * 基础数据类型的引用值转换
 * user{普通值不需要转}、@(schema){页面运行时状态}、@(interMeta){元数据描述}、@(ctx){当前上下文}
 * 如何支持额外情况:
 * 1. username 转成 @(schema).did1 「映射一个个转?」
 */
export type Ref2ValueOfFoundation  = string;

/**
 * 数据结构的引用值转换 [接口请求的set仅能使用数组描述]
 */
export interface Ref2ValueOfArr {
  type:  ComplexType.structArray;
  struct: Ref2ValueOfFoundation[] | TransfMapping[];
}
/**
 * 对象结构的引用值转换「set仅使用Obj类型」
 */
export interface Ref2ValueOfObj {
  type: ComplexType.structObject;
  struct: TransfMapping[];
}

/**TODO: 还需要考虑: 过滤函数/映射函数 */

/** 将IUB的引用值转换为实际值的抽象定义{get时候使用} */
export type Ref2Value = Ref2ValueOfObj | Ref2ValueOfArr | Ref2ValueOfFoundation;

/** 仅复杂处理类型 */
export type Ref2ValueOfComplex = Ref2ValueOfObj | Ref2ValueOfArr;


export interface Ref2ValueCollection {
  [id: string]: Ref2ValueOfComplex
}

/** 定位就是一个转换数据的「递归转换有点复杂先不支持」(get/set) (transform是外部支持的)  */
interface Ctx {
  path: string;
  keyHandle: any;
  valueHandle: any;
  itemHandle: any;
  itemNextHandle: any;
}

const fn1 = (v) => {
  if (v.type === ComplexType.structArray) {
    v.struct.forEach((vv) => {
      if (typeof vv === 'string') {
        // valueHandle
      } else {
        const { key, value } = vv;
        // keyHanle
        if (typeof value === 'string') {
          // valueHandle
        } else {
          // 递归
          fn1(value);
        }
      }
    });
  }
  if (v.type === ComplexType.structObject) {

  }

  // err
  return '';

};