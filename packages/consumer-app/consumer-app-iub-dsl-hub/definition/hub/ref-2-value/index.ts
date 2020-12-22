import { ComplexType } from "../../schema";

/**
 * 基础数据类型的引用值转换
 * user{普通值不需要转}、@(schema){页面运行时状态}、@(interMeta){元数据描述}、@(ctx){当前上下文}
 * 如何支持额外情况:
 * 1. username 转成 @(schema).did1 「映射一个个转?」
 */

/** TODO: 还需要考虑: 过滤函数/映射函数 */

export interface Ref2ValCollection {
  [mark: string]: Ref2ValDef & BaseConf
}

export type refIdOfRef2Value = string;

/** 
 * 至少有key/val的映射结构
 * 引用结构转值结构每项的结构map 
 * 将IUB的引用值转换为实际值的抽象定义{get时候使用}
 */
export interface ref2ValStructMap {
  val: string | Ref2ValDef;
  key: string;
  extral?: string | string[] | { [str: string]: string };
  // [str: string]:  string;
}

export interface Ref2ValDef {
  type: ComplexType;
  // struct: (ref2ValStructMap /** | string */)[]
  struct: (ref2ValStructMap)[]
}

interface BaseConf {
  lazyParser?: boolean;
}