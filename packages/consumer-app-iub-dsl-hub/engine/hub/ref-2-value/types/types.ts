import { ComplexType, Ref2ValDef } from "@iub-dsl/definition";

/**
 * /(?<=[\\/]?)([\\[]?)([^\\/\\[\]]+)([\]]?)(?:[\\/]?)/g;
 * 层级规则: 
 * XX层级第N组下标标识(#(level|idx) , 写法: #(0|*) 意为: 第0层的所有下标
 * 1. a[#(0|*)]/b[#(1|*)], #(0|*), 会跟随上级的所有idx 
 * 2. a[#(0|0)]/b[#(1|*)], #(0|0), 仅使用第0层的idx = 0
 * 3. #(exp1|exp2), 层级/idx都可以是表达式计算的数字 「扩展、但挺难的」
 */

/*———————————————— Base ————————————————*/

/** 引用结构转为值结构 所有可以引入的插件 */
export type Ref2ValPlugins = Partial<Ref2ValRunPlugins & Ref2ValParserPlugins>;

/** 
 * 引用结构转为值结构的基础的上下文
 */
export interface Ref2ValBaseCtx {
  /** 层级数据 「每一层下标记录, object为0」 */
  levelArr: number[];
  /** 当前层级 */
  level: number;
  refPathInfoList: RefPathInfoList;
  struct2ParseRes: WeakMap<Ref2ValDef, LayerParseRes>;
}

export interface RefPathInfoList {
  [str: string]: RefItemPathInfo
}


/**
 * 每一项解析后的信息
 */
export type RefItemPathInfo = PathInfo[]

/**
 * 路径信息解析结果的定义
 */
export interface PathInfo {
  // root/identifier/expression
  type: string;
  match: string | levelMath;
  rootPath: string;
  prevPath: string;
  path: string;
  fullPath: string;
  getDepth: number;
  // scope: string; // root/child/descendant
}
interface levelMath {
  level: string;
  idx: string;
}


/*———————————————— Parse ————————————————*/

/**
 * 引用结构转为值结构 解析时可以扩展的插件
 */
export interface Ref2ValParserPlugins {
  matchRoot?: (matchStr: string) => [string, string];
  vaildPath?: (str: string) => boolean
  itemParser?: any;
  /**
   * groupParser/layerParser
   * 可以多扩展 解析前(添加更多配置)/解析后(额外处理解析结果)
   */
  layerParser?: any;
  // groupParser?: any; 目前解析的时候 layer === group
}

/**
 * 引用结构转为值结构 解析时的上下文
 */
export interface Ref2ValParseCtx extends Ref2ValBaseCtx, Required<Ref2ValParserPlugins> {
  
}

export interface LayerParseRes {
  rootPathInfo: PathInfo[];
  scopePathInfo: PathInfo[] 
  scopePaths: string[];
  refPathInfo: RefPathInfoList;
  conf: Ref2ValDef;
}


/*———————————————— Run ————————————————*/

export interface Ref2ValRunCtx extends Ref2ValBaseCtx, Required<Ref2ValRunPlugins> {
/** 根节点数据 */
  rootData: {
    [str: string]: any;
  };
  /** 当前作用域数据 */
  scope: {
    [path: string]: any;
  };

  getScope: any;
}
/**
 * 引用结构转为值结构 运行时候可以扩展的插件
 * TODO: 代完善
 */
export interface Ref2ValRunPlugins {
  getRootData?: any;
  getScopeData?: any;
  itemHandler?: any;
  groupHandler?: any;
  layerHandler?: any;
}