import { FuncCodeOfAPB, APBDefOfIUB, RefType, InterRefRelation, ResResolveOfFuncCode } from "@iub-dsl/definition";
import { RunTimeCtxToBusiness, DispatchModuleName, DispatchMethodNameOfMetadata } from "../../runtime/types";
import { extraHandleStrategy } from "./api-req-extra-handle-strategy";
import { APBTransf } from "./APB-transf";
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
    // console.log(list, steps);
    const handleStrategyEntity = extraHandleStrategy();
    
    /** 挟持结果 */
    const fnWrap = (fn) => async (IUBCtx: RunTimeCtxToBusiness, ...args) => {
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
      // APBTransf(listRes, orgignConf)
      const APBDSL = APBTransf(transfRes);
      return APBDSL;
    };
  
    const resTransfFn = (IUBCtx, reqRes) => {
      /** 
       * 转换
       * 1. 将重命名的字段转换「确保准确性」
       * 2. 将数据结构转换「可以加入数据更新插件」
       */
      return Array.isArray(reqRes) ? reqRes[0] : reqRes;
    };

    return {
      reqTransfFn,
      resTransfFn
    };
  };
  
  /**
   * 职责: 将描述数据/引用数据, 处理成可以使用的真实值的数据
   */
  const extraAPBItemParser = ({ APBItemConf: conf }: { APBItemConf: APBDefOfIUB }) => {
    /**
     * set 、table转换; condition 处理
     */
    const { funcCode } = conf;
    let runFn: any = async (...args) => {};
    let set;
    switch (conf.funcCode) {
      case FuncCodeOfAPB.C:
        set = bindRef2Value(conf.set);
        runFn = async (IUBCtx) => {
          return {
            ...conf,
            set: await set(IUBCtx),
          };
        };
        break;
      case FuncCodeOfAPB.U:
        // conf.set
        // conf.table
        // conf.condition
        break;
      case FuncCodeOfAPB.D:
        // conf.table
        // conf.condition
        break;
      case FuncCodeOfAPB.R:
      /** 单独的read处理 */
        console.log(conf);
      
        runFn = async () => conf;
        // conf.readDef
        // conf.readList
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
    extraAPBItemParser: extraAPBItemParser
  };

  return apiReqExtraParser;
};
