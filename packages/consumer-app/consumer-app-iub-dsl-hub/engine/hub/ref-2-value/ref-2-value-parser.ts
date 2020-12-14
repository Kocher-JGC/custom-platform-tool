import { isPlainObject } from 'lodash';
import { 
  Ref2ValParseCtx, Ref2ValParserPlugins, PathInfo,
  Ref2ValRunCtx, RefPathInfoList, LayerParseRes, Ref2ValRunPlugins, Ref2ValPlugins
} from "./types";
import { mockRefStruct, mockData } from "./mock";
import { isIUBDSLMark, defaultPickMark, pickRef2ValMark } from "../../IUBDSL-mark";
import {
  ref2ValRunWrap,
  getScope, getRootData, getScopeData,
  itemHandler, groupHandler, layerHandler 
} from './ref-2-value-run';
import { Ref2ValDef, ref2ValStructMap, Ref2ValCollection } from '@iub-dsl/definition';
import { RunTimeCtxToBusiness } from '../../runtime/types';
import { noopError, noopRun } from '../../utils';

const vaildPath = isIUBDSLMark;

const matchRoot = (str: string): [string, string] => {
  /** IUBDSLMark */
  const [rootMark, childPath] = defaultPickMark(str);
  return [rootMark, childPath];
};

/**
 * 描述结构支持扩展「扩展不同的解析器」
 * 但是获取结构是固定的
 */
/** 切割每一层的正则 */
const splitPathRegExp = /(?<=[\\/]?)([\\[]?)([^\\/\\[\]]+)([\]]?)(?:[\\/]?)/g;
const pickArrRegExp = /(?<=\[?)([^\\[\]]+)(?=\]?)/g;
const pickArr = (str: string) => str.match(pickArrRegExp) || [];
const MARK = '/';
const TOP_MARK = 'TOP';

/**
 * 引用结构转值结构的解析器
 * @param confCollection 引用结构转值结构的配置集合
 * @param pluginsC 插件集合
 */
export const ref2ValueParser = (confCollection: Ref2ValCollection = mockRefStruct, pluginsC?) => {
  const ref2ValCKeys = Object.keys(confCollection);
  const { addResolve, isResolve } = parserControl(ref2ValCKeys);
  /** 解析存储的列表 */
  const ref2ValList = {};
  /** 解析后的路径信息储存列表 */
  const refPathInfoList = {};
  const struct2ParseRes = new WeakMap();

  const parseCtx: Ref2ValParseCtx = { 
    refPathInfoList, struct2ParseRes,
    vaildPath, matchRoot, levelArr: [], level: 0,
    itemParser: ref2ValItemParser, layerParser: ref2ValLayerParser
  };

  ref2ValCKeys.forEach(id => {
    const itemConf = confCollection[id];
    if (itemConf?.lazyParser === true) {
      ref2ValList[id] = itemConf;
    } else {
      ref2ValList[id] = ref2ValParser(parseCtx, itemConf);
      addResolve(id);
    }
  });

  // ref2ValList.id({
  //   action: { payload: mockData }
  // }, runCtx);
  
  const bindRef2Value = (ref2ValId: string, plugins: Ref2ValPlugins = {}) => {
    ref2ValId = pickRef2ValMark(ref2ValId);
    /**
     * 最后一层包装函数
     */
    return (context: RunTimeCtxToBusiness, runPlugins: Ref2ValRunPlugins = {}) => {
      let ref2ValIdRunFn = ref2ValList[ref2ValId];
      if (typeof ref2ValIdRunFn !== 'function') {
        console.error(`获取引用结构转值结构函数失败!: ${ref2ValId}`);
        ref2ValIdRunFn = noopError;
      }
      const runCtx: Ref2ValRunCtx = mergeFn({
        levelArr: [], level: -1, rootData: {}, scope: {},
        refPathInfoList, struct2ParseRes,
        getScope, getRootData, getScopeData,
        itemHandler, groupHandler, layerHandler, itemKeyHandler: noopRun
      }, plugins.run, runPlugins);
      
      return ref2ValIdRunFn(plugins.parse)(context, runCtx);
    };
  };

  return {
    bindRef2Value
  };
};

/**
 * ref2Val的解析器
 * 1. 一项里面可以有多个匹配 「path」
 * 2. 一项里面仅有val有可能有结构「struct」
 * 3. 一层有多个项
 * @param parseCtx 解析时上下文
 * @param originConf 原始ref2Val配置, 「最顶层」
 */
const ref2ValParser = (parseCtx: Ref2ValParseCtx, originConf: Ref2ValDef) => {
  return (parserPlugins: Ref2ValParserPlugins = {}) => {
    parseCtx = mergeFn(parseCtx, parserPlugins);
    /** 解析前重置参数 */
    // parseCtx.levelArr = [];
    // parseCtx.level = -1;
    const { itemParser, layerParser, refPathInfoList } = parseCtx;
    
    const actralParser = (parseStruct: Ref2ValDef) => {
      const refPathInfoOfLayer: RefPathInfoList = {};
      /**
       * 目前解析的时候暂时 没用, 预留
       */
      // parseCtx.levelArr.push(0);
      // parseCtx.level++;
      const { struct } = parseStruct;
      struct.forEach(structItem => {
        const itemPRes = itemParser(parseCtx, structItem);
        Object.assign(refPathInfoOfLayer, itemPRes);
        /**
         * 每层/组的解析
         */
        const { val } = structItem;
        if (isPlainObject(val)) {
          actralParser(val as Ref2ValDef);
        }
      });
      Object.assign(refPathInfoList, refPathInfoOfLayer);

      layerParser(parseCtx, parseStruct, refPathInfoOfLayer);
    };
    /** 新层/组 
     * 目前解析的时候 layer === group
     */
    actralParser(originConf);

    /** 返回可以运行的函数 */
    return ref2ValRunWrap(originConf, parseCtx);
  };
};

/**
 * 一项Ref2Val配置解析引用路径的解析器
 * @param parseCtx 解析时上下文
 * @param ref2ValItem 一项ref2Val配置
 */
const ref2ValItemParser = (parseCtx: Ref2ValParseCtx,ref2ValItem: ref2ValStructMap) => {
  const { val } = ref2ValItem;
  const { vaildPath, refPathInfoList } = parseCtx;
  const itemPRes = {};
  /** 仅对有效的描述进行解析 */
  if (typeof val === 'string' && vaildPath(val)) {
    const refItemPathInfo = refPathInfoList[val] ? refPathInfoList[val] : refPathParser(parseCtx, val);
    /** 储存结果 */
    itemPRes[val] =  refItemPathInfo;
  }
  return itemPRes;
};

/**
 * 一层ref2Val配置的解析器
 * @param parseCtx 解析时上下文
 * @param conf 一层Ref2Val的配置
 * @param refPathInfo 已经被解析的pathInfo信息
 */
const ref2ValLayerParser = (parseCtx: Ref2ValParseCtx, conf: Ref2ValDef, refPathInfo: RefPathInfoList) => {
  const { struct2ParseRes } = parseCtx;
  /** 深度为下标, 记录PathInfo信息的二维数组 */
  const getDepthArr: PathInfo[][] = [];
  const rootPathInfo: PathInfo[] = [];
  const scopePaths: string[] = [];

  Object.values(refPathInfo).forEach((vals) => {
    vals.slice(0, -1).forEach((item: PathInfo) => {
      const { getDepth, type, fullPath } = item;
      if (!scopePaths.includes(fullPath)) {
        scopePaths.push(fullPath);
        if (type === 'root') {
          rootPathInfo.push(item);
        } else {
          (getDepthArr[getDepth] || (getDepthArr[getDepth] = [])).push(item);
        }
      }
    });
  });
  const scopePathInfo = getDepthArr.flat();
  const layerParseRes: LayerParseRes = {
    refPathInfo, rootPathInfo,
    scopePathInfo, scopePaths, conf
  };
  struct2ParseRes.set(conf, layerParseRes);
};

/**
 * 引用路径信息的解析器, 生成  pathInfoArr[]
 * @param parseCtx 解析时上下文
 * @param refPath 字符串
 */
const refPathParser = (parseCtx: Ref2ValParseCtx, refPath: string) => {
  const { matchRoot } = parseCtx;
  /** 提取 根path, 子path */
  const [rootPath, childPath] = matchRoot(refPath);
  /** 根节点的描述 */
  const rootInfo: PathInfo = { type: 'root', match: rootPath, path: rootPath, rootPath, fullPath: rootPath, prevPath: '', getDepth: 0 };
  /** 该描述完整的路径信息的描述 */
  const pathInfoArr = childPathParser(childPath, rootPath);
  /** 添加根 */  
  const l = pathInfoArr.unshift(rootInfo);
  /** 删除最后path多余的‘/’ */
  if (l > 1) {
    pathInfoArr[l - 1].path = pathInfoArr[l - 1].path.slice(0, -1);
  }
  return pathInfoArr;
};

/**
 * 将子路径分割成有深度的层路径信息 「子」 pathInfo[]
 * @param path 子路径
 * @param rootPath 根路径
 */
const childPathParser = (path: string, rootPath: string) => {
  const pathInfoArr: PathInfo[] = [];
  let prevPath = '', getDepth = 1;
  path.replace(splitPathRegExp, (path, lKey, match: string, rKey) => {
    const baseInfo = { rootPath, prevPath, getDepth, fullPath: rootPath + prevPath + path };
    const pathInfo = genPathInfo({ path, match });
    pathInfoArr.push(Object.assign(pathInfo, baseInfo));
    prevPath+=pathInfo.path;
    getDepth++;
    return '';
  });
  return pathInfoArr;
};

/**
 * 根据路径描述规则, 区分identifier/expression 
 * @param param0 必要参数
 */
const genPathInfo = ({ match, path }) => {
  /** 需要考虑更多的后续扩展 */
  /** 内部的切割规则 */
  const splitMatch = match.split('|');
  const lastIdx = path.lastIndexOf(MARK);
  path = lastIdx > -1 && lastIdx + 1 === path.length ? path : path + MARK;
  if (splitMatch.length === 2) {
    return { 
      type: 'expression', path,
      match: { 
        level: splitMatch[0].slice(2), 
        idx: splitMatch[1].slice(0, -1)
      }, 
    };
  }
  return { type: 'identifier', match: splitMatch[0], path };
};


const parserControl = (keys: string[]) => {
  /**
   * 扩展: lazyParser
   */
  /** 是否已被解析的记录 */
  const resolveRecord = keys.reduce((res, k) => ({ ...res, [k]: false }), {});
  const isResolve = (key: string) => resolveRecord[key] || false;
  const addResolve = (key: string) => resolveRecord[key] = true;
  
  return {
    isResolve,
    addResolve
  };
};

/**
 * 合并插件的函数
 */
const mergeFn = (target, ...sources) => {
  const res = Object.assign({}, target);
  
  sources?.forEach((source) => {
    if (source && typeof source === 'object') {
      const sourceKeys = Object.keys(source);
      sourceKeys.forEach(key => {
        const item = source[key];
        if (typeof item === 'function') {
          res[key] = item(res[key]);
        }
      });
    }
  });
  return res;
};


/**
 * 通用包装函数的定义
 * 1. 挟持原始函数, 不改变传入值和返回值
 * 2. 挟持原始函数, 包装传入值, 不改变返回值
 * 3. compose挟持原始函数, 多次包装传入值, 最后一个运行的函数返回原始需要的返回值
 * 4. 弃用原始函数, 完全新逻辑
 */
interface CommonWrapFn<
  P extends any[] = any[],
  R = any,
  FN extends (...args: any[]) => any = (...args: P) => R
> {
  (originFn: FN): (...args: P) => R;
}

const commonWrapFn: CommonWrapFn = (originFn) => (...args) => originFn(...args);