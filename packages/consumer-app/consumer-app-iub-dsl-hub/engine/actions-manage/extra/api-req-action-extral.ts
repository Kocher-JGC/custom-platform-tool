import { FuncCodeOfAPB, APBDefOfIUB, RefType, InterRefRelation, ResResolveOfFuncCode, ReadBaseInfo } from "@iub-dsl/definition";
import { cloneDeep } from 'lodash';
import { RunTimeCtxToBusiness, DispatchModuleName, DispatchMethodNameOfMetadata, DispatchMethodNameOfIUBStore } from "../../runtime/types";
import { extraHandleStrategy } from "./api-req-extra-handle-strategy";
import { APBTransf } from "./APB-transf";
import { arrayAsyncHandle, noopError } from "../../utils";

interface TodoRecord {
  [str: string]: {
    onlyKey: string;
    needHandleFns: any[];
    /** ...其他属性扩展 */
  }
}

/** 
 * 该策略, 储存的realation, 以及refType
 * 获取相关表的所有关系, 让策略自己选择 「目前这个, 更好的待思考」
 * 
 */

const handleFn = {
  getStrategy: ({ reqType }) =>'',
  itemHandle: '能够获取XX项的处理结果, 返回新的结果',
  reqTransfHandle: '',

};

const onlyKeySplit = '|';

/** 应该支持多个 */
export const genAPBId = (key: string ,num = 1) => ({ [key]: `$ID(${num})` });
export const genResolveOfIUB = (stepsId: string, resolves: { [str: string]: string; }[]): ResResolveOfFuncCode => ({
  stepsId,
  funcCode: FuncCodeOfAPB.ResResolve,
  resolver: resolves.reduce((res, obj) =>({ ...res, ...obj }), {})
});

/** 
 * 在哪里设置
 * 设置什么值
 */
export const extraSetFn = (set: any[], key) => (setFn) => {
  set.forEach((item, idx) => {
    item[key] = setFn(item, key, idx);
  });
};

/**
 * 职责: 额外的策略处理
 * 策略: 新增外键/读取连表
 */
export const genApiReqPlugins = (parseRes) => {
  const { 
    ref2ValueParseRes,
    condParseRes,
  } = parseRes;

  const { bindRef2Value } = ref2ValueParseRes;
  const { bindCondition } = condParseRes;
  /**
   * extraReqParser
   */
  const APIReqExtraParser = ({ 
    listPRes, listKeys,
    steps, list,
  }) => {
    const handleStrategyEntity = extraHandleStrategy();
    
    /** 挟持结果 */
    const fnWrap = (fn) => async (IUBCtx: RunTimeCtxToBusiness, ...args) => {
      if (typeof fn !== 'function') {
        console.error('非法传入!!!, 请传入Function!');
        return noopError;
      }
      /**
       * 读取
       * 1. 将字段结合表名拼接
       * 2. 获取表关系,
       * 3. 表关系的处理 「1. 转换额外的连表 / 2. 返回结果转换」
       * 4. 返回结果转换
       */
      const itemRunRes = await fn(IUBCtx , ...args);
      /** 分析 analysisRes, 添加有用的数据 */
      /** 关系收集暂时不处理 itemRunRes所以不返回 */
      await handleStrategyEntity.itemHandle(IUBCtx, itemRunRes);
      if (Array.isArray(itemRunRes?.set)) {
        itemRunRes.set = itemRunRes.set.map(item => Object.keys(item).reduce((r, k)=> ({ ...r, [k.split('.')[1] || k]: item[k] }), {}));
      }
      /** 分析同时, 将Read的表名和字段名重命名 「确保准确性」 */

      /** APBDSL ItemTransform 单项的转换 */
      return itemRunRes;
    };
    /** 包装一层 */
    listKeys.forEach(key => listPRes[key] = fnWrap(listPRes[key]));
    
    const reqTransfFn = async (IUBCtx, listRunRes /** 每一项转换的结果 */) => {
      /** 根据 analysisRes 生成额外的拼接数据 「确保完整性、递归熔断」 */
      const transfRes = handleStrategyEntity.reqTransfHandle(IUBCtx, { list: listRunRes, steps: steps.slice(0) });
      /** steps 组装 + APBDSL转换 */
      const APBDSL = APBTransf(transfRes);
      return APBDSL;
    };
  
    const resTransfFn = (IUBCtx: RunTimeCtxToBusiness, reqRes) => {
      /** 
       * 转换
       * 1. 将重命名的字段转换「确保准确性」
       * 2. 将数据结构转换「可以加入数据更新插件」
       */
      const res = Array.isArray(reqRes) ? reqRes[0] : reqRes;
      /** 先写死 */
      // debugger
      if (res && res.data) {
        if (!IUBCtx.action) IUBCtx.action = {};
        IUBCtx.action.payload = res.data;
      }
      return res;
    };

    return {
      reqTransfFn,
      resTransfFn
    };
  };

  const getInterMetaCode = async (IUBCtx: RunTimeCtxToBusiness, id: string) => {
    const { asyncDispatchOfIUBEngine } = IUBCtx;
    return await asyncDispatchOfIUBEngine({
      dispatch: {
        module: DispatchModuleName.metadata,
        method: DispatchMethodNameOfMetadata.id2Code,
        params: [id]
      }
    });
  };
  const getSchemaVal = async (IUBCtx: RunTimeCtxToBusiness, mark: string) => {
    const { asyncDispatchOfIUBEngine } = IUBCtx;
    return await asyncDispatchOfIUBEngine({
      dispatch: {
        module: DispatchModuleName.IUBStore,
        method: DispatchMethodNameOfIUBStore.getPageState,
        params: [mark]
      }
    });
  };
  
  /**
   * 职责: 将描述数据/引用数据, 处理成可以使用的真实值的数据
   */
  const extraAPBItemParser = ({ APBItemConf: conf }: { APBItemConf: APBDefOfIUB }) => {
    /**
     * set 、table转换; condition 处理
     */
    const { funcCode } = conf;
    let runFn: any = async (...args) => ({});
    let set;
    switch (conf.funcCode) {
      case FuncCodeOfAPB.C:
        set = bindRef2Value(conf.set);
        runFn = async (IUBCtx) => {
          return {
            ...conf,
            table: await getInterMetaCode(IUBCtx, conf.table),
            set: await set(IUBCtx, {
              itemKeyHandler: () => async (key: string) => {
                const k = await getInterMetaCode(IUBCtx, key);
                const keys = k.split('/');
                if (!keys[1]) console.warn(`获取code错误!${key}`);
                return keys[1] || keys[0];
              }
            }),
          };
        };
        break;
      case FuncCodeOfAPB.U:
        set = bindRef2Value(conf.set);
        runFn = async (IUBCtx) => {
          return {
            ...conf,
            table: await getInterMetaCode(IUBCtx, conf.table),
            set: await set(IUBCtx, {
              itemKeyHandler: () => async (key: string) => {
                const k = await getInterMetaCode(IUBCtx, key);
                const keys = k.split('/');
                if (!keys[1]) console.warn(`获取code错误!${key}`);
                return keys[1] || keys[0];
              }
            }),
            condition: {
              and: [{
                equ: { id: await getSchemaVal(IUBCtx, conf.condition) }
              }]
            }
          };
        };
        break;
      case FuncCodeOfAPB.D:
        runFn = async (IUBCtx: RunTimeCtxToBusiness) => {
          return {
            ...conf,
            table: await getInterMetaCode(IUBCtx, conf.table),
            condition: {
              and: [{
                equ: { id: await getSchemaVal(IUBCtx, conf.condition) }
              }]
            }
          };
        };
        // conf.table
        // conf.condition
        break;
      case FuncCodeOfAPB.R:
        /** 单独的read处理 */
        runFn = async (IUBCtx: RunTimeCtxToBusiness) => {
          /** 临时写死逻辑 */
          const newConf = cloneDeep(conf);
          let temp: any;
          // eslint-disable-next-line no-cond-assign
          if ((temp = newConf.readList.staticId) && temp.condition) {
            /** 配置传入/ 或写死传入 */
            temp.condition = {
              and: [{
                equ: { id: await getSchemaVal(IUBCtx, temp.condition) }
              }]
            };
          }
          return newConf;
        };
        break;
      default:
        break;
    }
    return async (ctx) => {
      const itemRunRes = await runFn(ctx);
      return itemRunRes;
    };
  };

  const apiReqExtraParser = {
    extraReqParser: APIReqExtraParser,
    extraAPBItemParser
  };

  return apiReqExtraParser;
};
