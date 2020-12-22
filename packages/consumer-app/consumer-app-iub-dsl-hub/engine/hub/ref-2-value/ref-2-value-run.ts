/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */

import { Ref2ValDef, ref2ValStructMap, ComplexType } from '@iub-dsl/definition';
import { isRunCtx , isSchema } from "../../IUBDSL-mark";
import { 
  Ref2ValParseCtx,
  PathInfo, Ref2ValRunCtx, LayerParseRes
} from "./types";
import { arrayAsyncHandle } from '../../utils';

import { DispatchModuleName, DispatchMethodNameOfIUBStore } from '../../runtime/types';

// const run = bindRef2Value(conf.set, {
//   parse:{ 
//   },
//   run: {
// itemKeyHandler: () => (key: string) => {
//   console.log(key);
//   return key;
// }
// }
// })

/**
 * 
 * 项的运行可以获取
 *  1. 当前组的运行结果
 *  2. 当前层的运行结果
 *  3. 当前项的运行结果
 */
export const itemHandler = (IUBctx, runCtx: Ref2ValRunCtx, { 
  structItem, layerRunRes, groupRunRes
}) => {
  const { scope, refPathInfoList } = runCtx;
  if (typeof structItem.val === 'string') {
    const refPathInfo = refPathInfoList[structItem.val];
    const pathInfo = refPathInfo[refPathInfo.length - 1];
    const { prevPath, path, rootPath } = pathInfo;
    let val = scope[rootPath + prevPath];
    val && (val = typeof path === 'string' ? val[path] : val);
    return {
      [structItem.key]: val
    };
  } 
  if (layerRunRes) {
    return {
      [structItem.key]: layerRunRes
    };
  }
  
};

/**
 * 组的运行可以获取
 *  1. 当前组的运行结果
 *  2. 当前层的运行结果
 */
export const groupHandler = async (IUBctx, runCtx: Ref2ValRunCtx, { struct, groupRunRes, layerRunRes }) => {
  return groupRunRes.reduce((res, obj) => ({ ...res, ...obj }), {});
};
export const layerHandler = async (IUBctx, runCtx: Ref2ValRunCtx, { conf, layerRunRes }) => {
  const { type } = conf;
  return type === ComplexType.structObject ? layerRunRes[0] : layerRunRes;
};

export const shouldLoop = (IUBctx, runCtx: Ref2ValRunCtx, { layerRunRes, loopNum, layerParseRes   }) => {
  const { level, scope } = runCtx;
  const { scopePathInfo } = layerParseRes as LayerParseRes;
  /** 获取具有等级信息的path */
  const sameLevelPaths = scopePathInfo.filter((pathInfo: PathInfo) => {
    const { match } = pathInfo;
    if (typeof match === 'object') {
      return +match.level === level;
    }
    return false;
  }).map(info => info.rootPath + info.prevPath);
  
  /** 都是对象那么就运行一次 */
  if (sameLevelPaths.length === 0 && loopNum === 0) return true;

  /** 验证是否可以循环, 待修改 */
  return !sameLevelPaths.every((path) => {
    const scopeData = scope[path];
    if (Array.isArray(scopeData) && scopeData.length < loopNum + 1) {
      return true;
    }
    return false;
  });
};

export const ref2ValRunWrap = (originConf: Ref2ValDef, parseCtx: Ref2ValParseCtx) => {
  const { struct2ParseRes } = parseCtx;
  return async (IUBctx, runCtx: Ref2ValRunCtx) => {
    const { 
      getScope, levelArr, itemHandler, itemKeyHandler,
      groupHandler, refPathInfoList, layerHandler 
    } = runCtx;

    const layerRunFn = async (conf: Ref2ValDef) => {
      const pRes = struct2ParseRes.get(conf);
      if (pRes) {
        /** 一层的运行 */
        const layerRunRes: any[] = [];
        const { struct, type } = conf;
        levelArr.push(0);
        runCtx.level++;
        /** 一组的运行 */
        const groupRunFn = async (loopNum = 0) => {
          const groupRunRes: any[] = [];

          /** 一项的运行函数 */
          const itemRunFn = async (structItem: ref2ValStructMap) => {
            /** 一项里面有很多path, { val: path1, key: path2, xxx: path3, ....  } */
            const { key, val, extral } = structItem;
            structItem.key = await itemKeyHandler(key);
           
            /** 新的一层: 后续再思考优化 */
            if (typeof val === 'object') {
              const onceLayerRes = await layerRunFn(val);
              const itemRes = await itemHandler(IUBctx, runCtx, { structItem, groupRunRes, layerRunRes: onceLayerRes });
              itemRes !== undefined &&  groupRunRes.push(itemRes);
            } else {
              const refPathInfo = refPathInfoList[val];
              if (refPathInfo) {
                const itemRes = await itemHandler(IUBctx, runCtx, { structItem, groupRunRes });
                itemRes !== undefined &&  groupRunRes.push(itemRes);
              } else { 
                /** 未解析的重新解析, 目前暂不考虑 */
                groupRunRes.push({ [structItem.key]: structItem.val });
              }
            }
          };

          await arrayAsyncHandle(struct, { handle: itemRunFn });
          const onceGroupRes = await groupHandler(IUBctx, runCtx, { struct, groupRunRes, layerRunRes  });
          onceGroupRes !== undefined &&  layerRunRes.push(onceGroupRes);
          return onceGroupRes;
        };
        /** 一组的运行 -- end */

        if (type === ComplexType.structObject) {
          /** 获取当前作用域的数据 */
          await getScope(IUBctx, runCtx, pRes);
          await groupRunFn();
        } else {
          let loopNum = 0;
          /**
           * 1. 重设上下文、改变level、控制循环
           */
          const loopFn = async () => {
            runCtx.scope = {};
            /** 获取当前作用域的数据 */
            await getScope(IUBctx, runCtx, pRes);
            const loop = shouldLoop(IUBctx, runCtx, { layerRunRes, loopNum, layerParseRes: pRes } );
            if (loop === true) {
              /** 疑惑: 为什么在此处++才是对的 */
              await groupRunFn(loopNum++);
              levelArr[runCtx.level] = loopNum;
              await loopFn();
            }
          };
          await loopFn();

        }
        /** 一层得运行结果 */
        const onceLayerRes = await layerHandler(IUBctx, runCtx, { conf, layerRunRes });
        /** 出栈 */
        runCtx.levelArr.pop();
        runCtx.level--;
        return onceLayerRes;
      }
      return {};
    };
    const res = await layerRunFn(originConf);
    console.log(res);
    return res;
  };
};

/**
 * 根据规则获取对应路径作用域信息的值
 * @param IUBctx IUB运行时上下文
 * @param runCtx 引用结构转值结构运行时上下文
 * @param itemInfo 每一项的引用路径信息
 */
export const getRootData = async (IUBctx, runCtx: Ref2ValRunCtx, rootPathInfo: PathInfo) => {
  const { action, asyncDispatchOfIUBEngine } = IUBctx;
  const { payload } = action || {};
  const { rootPath } = rootPathInfo;
  if (isSchema(rootPath)) {
    const IUBRunState = await asyncDispatchOfIUBEngine({
      dispatch: {
        module: DispatchModuleName.IUBStore,
        method: DispatchMethodNameOfIUBStore.getPageState,
        params: ['']
      }
    });
    
    return IUBRunState;
  } if (isRunCtx(rootPath)){
    /** isRunCtx */
    return { payload };
  }
};

/**
 * 根据规则获取对应路径作用域信息的值
 * @param IUBctx IUB运行时上下文
 * @param runCtx 引用结构转值结构运行时上下文
 * @param pathInfo 路径信息
 */
export const getScopeData = async (IUBctx, runCtx: Ref2ValRunCtx, pathInfo: PathInfo) => {
  const { levelArr, scope } = runCtx;
  const { prevPath, match, rootPath } = pathInfo;
  if (typeof match === 'string') {
    return scope[rootPath + prevPath]?.[match];
  } 
  /** TODO: 未完善 */
  return scope[rootPath + prevPath]?.[levelArr[match.level]];
};

/**
 * 获取当前项所以作用域信息 「根据 RefItemPathInfo 运行的函数, 外部无法增强」
 * @param IUBctx IUB运行时上下文
 * @param runCtx 引用结构转值结构运行时上下文
 * @param layerPRes LayerParseRes
 */
export const getScope = async (IUBctx, runCtx: Ref2ValRunCtx, layerPRes: LayerParseRes) => {
  const { scope, getScopeData } = runCtx;
  const { scopePathInfo, rootPathInfo } = layerPRes;
  /** 确保根数据 */
  await ensureRootData(IUBctx, runCtx, rootPathInfo);
  /** 获取作用域数据 */
  await arrayAsyncHandle(scopePathInfo, {
    handle: async (pathInfo: PathInfo) => {
      const { prevPath, path, rootPath } = pathInfo; 
      scope[rootPath + prevPath + path] = await getScopeData(IUBctx, runCtx, pathInfo);
    }
  });
};

/**
 * 确保根数据
 * @param IUBctx IUB运行时上下文
 * @param runCtx 引用结构转值结构运行时上下文
 * @param rootPathInfo 路径信息
 */
export const ensureRootData = async (IUBctx, runCtx: Ref2ValRunCtx, rootPathInfo: PathInfo[]) => {
  const { getRootData, rootData, scope } = runCtx;
  await arrayAsyncHandle(rootPathInfo, {
    handle: async (info: PathInfo) => {
      const { path: rootPath } = info;
      /** 确保rootData存在 */
      if(!rootData[rootPath]) {
        const onceRootData = await getRootData(IUBctx, runCtx, info);
        /** 无顶级数据 */
        if (!onceRootData) { return false; }
        rootData[rootPath] = onceRootData;
      }
      /** 确保scope有根数据 */
      if (!scope[rootPath]) scope[rootPath] = rootData[rootPath];
    }
  });
};