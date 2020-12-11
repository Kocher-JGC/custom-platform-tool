import { pickapiReqMark } from './../../IUBDSL-mark';
import { noopBind, reSetFuncWrap } from '../../utils';
import { 
  APIReqType, APBDSLReq, 
  APIReqCollection
} from '@iub-dsl/definition';
import { RunTimeCtxToBusiness } from '../../runtime/types';

/**
 * 确保数据的准确性和完整型的额外处理规则
 */
/**
 * 新增, 根据 fields + 外键 拼接 「准确性」
 */
/**
 * 查询根据fields + 引用关系进行连表「完整性」
 * 「fields」
 * 1)整个页面数据读取
 * 1. 收集页面的数据 「schema」
 * 2. schema包含的 table + fields
 * 3. 转换、 生成数据 「回写schema的信息/字段的信息」「如何确保数据的完整性」
 * 需要读取有多少个字段「表id -> 哪几个表」「根据表的引用额外读取」
 * 2)表格读取 --> 可以知道当前表格有多少字段可以使用
 * 「page、sort」分页、排序
 */

/**
 * APBDSL请求的解析器
 * 1). 额外解析 每一项请求 「子」
 * 2). 额外解析 总   「父」
 * add - 新增节点 「影响多个节点」
 * read - 嵌套连表 「影响单个节点」
 * @description 根据程序运行规则, 从嵌套最内层开始运行, 外层可以获取内层结果, 同理,可以获取子运行结果
 * @param conf APBDSL请求的配置
 */
const APBReqParser = (conf: APBDSLReq) => {
  const { list, steps } = conf;
  const listPRes = {};
  // const funcList = Object.values(list);
  const listKeys = Object.keys(list || []);

  /**
   * APBDSL请求函数的包装函数
   * @param param0 额外的请求配置解析器
   */
  const APBReqFnWrap = ({
    extraReqParser,
    extraAPBItemParser,
    // extralAPBStepsParser, /** 暂无steps的额外解析 */
  }) => {
    /**
     * 方式二: 请求的额外解析和每一项的额外解析分开传入
     * 其实可以考虑仅传入 extraReqParser
     * 但是这样可以更灵活的分离函数
     */
    listKeys.forEach(key => {
      const APBItemConf = list[key];
      /** 每一项APB的转换函数 APBItemTransformFn */
      listPRes[APBItemConf.stepsId] = extraAPBItemParser({ key, APBItemConf, /** originFn // 暂无原始运行函数 */ });
    });
    /** 
     * APBDSL请求的配置的 解析的结果
     */
    const APBReqPRes = extraReqParser({ steps, list, listPRes, listKeys });
    const { reqTransfFn, resTransfFn  } = APBReqPRes;
    /**
     * 绑定运行时候需要的插件
     * 插件获取方式
     * 1. 绑定时候可以传入
     * 2. 运行时可以通过执行函数获取
     */
    return (plugins) => {
      /** bindAPIReq, 传入的请求处理函数  */
      const { requestHandler } = plugins; 
      /**
       * APBDSL 请求运行的实际函数
      */
      return async (IUBCtx: RunTimeCtxToBusiness) => {
        /** 每一项的运行 */
        const listRunRes = {};
        await Promise.all(listKeys.map(async key => {
          listRunRes[key] = await listPRes[key](IUBCtx); 
        }));

        /** 最终的运行: APBDSL + 一些必要的记录信息「请求的: 表+字段」*/
        const transfRes = await reqTransfFn(IUBCtx, listRunRes);
        // console.log(transfRes);
        
        /** 请求 */
        const reqRes = await requestHandler(transfRes);
        // console.log(reqRes);
        
      
        /** 根据上述描述数据 --> 对数据进行转换 */
        /** 根据配置数据 --> 对数据转换并写入变量 */
        return await resTransfFn(IUBCtx, reqRes);

        /** 最后还有一步,分发数据 */
      };
    };
  };

  return APBReqFnWrap;
};

/**
 * API请求的解析器
 * 解析API请求, 返回 请求函数的包装函数, 外部添加额外解析, 生成实际得请求函数
 * @param conf API请求配置
 */
export const APIReqParser = (conf: APIReqCollection) => {
  const APIReqIds = Object.keys(conf);
  const APIReqList = {};
  const typeMaps = {};
  
  APIReqIds.forEach(id => {
    const APIReqC = conf[id];
    switch (APIReqC.reqType) {
      case APIReqType.APBDSL:
        APIReqList[id] = APBReqParser(APIReqC);
        typeMaps[id] = APIReqType.APBDSL;
        break;
      default:
        APIReqList[id] = () => () => {};
        typeMaps[id] = null;
        break;
    }
  });

  const reSetAPIReq = reSetFuncWrap(APIReqIds, APIReqList);

  const bindAPIReq = (id: string, plugins) => {
    /** 绑定时, 额外解析并生成运行函数 */
    id = pickapiReqMark(id);
    let reqHandler = APIReqList[id] || noopBind;
    reqHandler = APIReqList[id] = reqHandler(plugins);
    return async (IUBCtx: RunTimeCtxToBusiness) => {
      const { requestHandler } = IUBCtx;
      /** 在上下文获取的 实际运行时的 请求函数 */
      if (typeof reqHandler === 'function') {
        return await reqHandler({ requestHandler })(IUBCtx);
      }
      /**
       * 请求时 + 请求后
       * 1. 转换/ 平级转换成嵌套
       * 2. 根据配置赋值
       */
      // return await reqHandler({ requestHandler })(ctx);
    };
  };


  return {
    bindAPIReq,
    reSetAPIReq,
    APIReqList,
    APIReqIds,
  };
};

const commonWrapFn = (originFn) => (...args) => originFn(...args);
