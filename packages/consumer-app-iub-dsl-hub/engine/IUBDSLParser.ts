import { TypeOfIUBDSL, APIReq, APBDefOfIUB, FuncCodeOfAPB } from "@iub-dsl/definition";
/** dont Overengineering */
import { schemaParser } from "./state-manage";
// import widgetParser from "./component-manage/widget-parser";
import { actionsCollectionParser } from "./actions-manage/actions-parser";
import { flowParser } from './flow-engine';
import { interMetaManage } from "./inter-meta-manage";
import { widgetParser } from "./widget-manage";
import { noopError, pickObj, noopTrueFn } from "./utils";
import { ref2ValueParser, conditionParser, interParser, APIReqParser } from "./hub";

/**
 * 1. 额外解析, 添加额外的业务处理逻辑
 * 2. 绑定其他的处理函数 「绑定函数的时候, 应该把模块需要的插件传入」
 */
const parser = () => { /** 解析器 */
  return (extralParser) => { /** 扩展解析 */
    return (plugins?) => { /** 绑定时候函数时传入的运行时需要使用的插件 */
      return (ctx) => { /** 运行时真丝的函数 */
      };
    };
  };
};
const xxxlist = {};
/**
 * 绑定解析完成的函数
 * @param mark 用于绑定的唯一标示
 * @param plugins 运行时需要的插件「也支持运行时动态获取插件」
 */
const bindFn = (mark, plugins?) => {
  const fn = xxxlist[mark];
  return (ctx) => {
    /** 也可以在运行时候ctx, 获取插件 */
    return fn(plugins)(ctx);
  };
};

/**
 * 1. 预解析
 * 2. 组合解析「根据配置组合的扩展解析」
 * 3. 绑定/使用 「传入运行时的插件」
 * 4. 运行 「传入运行上下文」
 * 
 * 1. 把原函数/参数/上下文传入 「X」
 * 2. 挟持原函数/返回新的处理函数 「这个会好一点」
 */


/**
 * 不推荐使用的默认解析
 */
export const defaultExtralParser = (any) => any;

const pickKeys = ['layoutContent', 'pageID', 'name', 'type', 'isSearch', 'businessCode', 'openPageUrl'];
/**
 * 扩展解析
 * 1. 公共依赖 + 依赖分析
 * 2. 动作 + 依赖分析
 * 3. 流程 「注入动作+条件」
 * 4. 事件 「注入流程函数」
 */

const IUBDSLExtral = (parseRes) => {
  const { 
    actionParseRes, widgetParseRes,
    flowParseRes,
    ref2ValueParseRes,
    condParseRes,
    APIReqParseRes
  } = parseRes;

  const { reSetAction, bindAction } = actionParseRes;
  const { reSetFlow, bindFlows, bindFlow } = flowParseRes;
  const { bindRef2Value } = ref2ValueParseRes;
  const { bindCondition } = condParseRes;
  const { bindAPIReq, APIReqList, APIReqIds } = APIReqParseRes;

  /** AOP */
  const actionExtralParser = (conf) => {
    // console.log(conf);
    const { actionBaseConf, actionOpts } = conf;
    // bindCondition
    if (actionBaseConf.actionType === 'changeState') {
      actionOpts.changeMapping = bindRef2Value(actionOpts.changeMapping);
    }
    return conf;
  };

  const flowExtralParser = (conf) => {
    const {  actionId, flowOutCondition, flowOut, condition } = conf;
    /** 解析和绑定 */
    const actionRunFn = bindAction(actionId);
    const flowOutFns = flowOut.map(bindFlows);
    const condRunFn = noopTrueFn;
    const flowOutCondFns = flowOutCondition.map(() => noopTrueFn);

    return  { 
      actionRunFn, condRunFn,
      flowOutFns, flowOutCondFns,
    };
  };


  /**
   * extralReqParser
   */
  const APIReqExtralParser = ({
    list, steps, reqType,
    listPRes, listKeys
  }) => {
    const analysisRes = {};
    /** 挟持结果 */
    const fnWrap = (fn) => async (...args) => {
      const res = await fn(...args);
      /** 分析 analysisRes, 添加有用的数据 */
      /** 分析同时, 将Read的表名和字段名重命名 「确保准确性」 */

      /** APBDSL ItemTransform 单项的转换 */
      return res;
    };
    /** 包装一层 */
    listKeys.forEach(key => listPRes[key] = fnWrap(listPRes[key]));
    
    const reqTransfFn = (ctx, listRes /** 每一项转换的结果 */) => {
      /** 根据 analysisRes 生成额外的拼接数据 「确保完整性、递归熔断」 */
      
      /** steps 组装 + APBDSL转换 */
    };
  
    const resTransfFn = (ctx, reqRes) => {
      /** 
       * 转换
       * 1. 将重命名的字段转换「确保准确性」
       * 2. 将数据结构转换「可以加入数据更新插件」
       */
    };
  };
  
  const extralAPBItemParser = (conf: APBDefOfIUB) => {
    /**
     * set 、table转换; condition 处理
     */
    const { funcCode } = conf;
    switch (conf.funcCode) {
      case FuncCodeOfAPB.C:
        // conf.set
        // conf.table
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
        // conf.readDef
        // conf.readList
        break;
      default:
        break;
    }
    return (ctx) => {
      return {};
    };
  };
  

  /**
   * 事件扩展解析, 在外部绑定实际调用函数
   * @param conf 事件配置
   */
  const eventExtralParser = (conf) => {
    const { flowItemIds, pageID /** 跨页面扩展 */ } = conf;

    /**
     * 1. 事件处理函数绑定流程处理 flowEngine
     * 2. 事件处理函数绑定低代码 lowcodeEngine
     * 3. ...
     */
    /** 绑定真实的事件处理函数 */
    const eventHandlerFn =  bindFlows(flowItemIds);

    return eventHandlerFn;
  };

  /** 所有action的额外的解析 */
  reSetAction((actionFnWrap) => actionFnWrap(actionExtralParser));

  /** 所有flow的额外的解析 */
  reSetFlow((flowFnWrap) => flowFnWrap(flowExtralParser));

  /** 所有widgetEvent的额外解析 */
  const widgetIds = Object.keys(widgetParseRes);
  widgetIds.forEach(id => {
    const onceWidgetPRes = widgetParseRes[id];
    const { eventHandlers, eventKeys = [] } = onceWidgetPRes;
    eventKeys.forEach(eKey => {
      eventHandlers[eKey] = eventHandlers[eKey]?.(eventExtralParser);
      /** 断言 */
      if (typeof eventHandlers[eKey] !== 'function') {
        console.error('事件绑定失败!!!', onceWidgetPRes, eventHandlers, eKey);
        eventHandlers[eKey] = () => noopError;
      }
    });
  });
  
};

const IUBDSLParser = ({ dsl }) => {
  console.log(dsl);
  
  const {
    schema, interMetaCollection,
    actionsCollection, flowCollection,
    ref2ValueCollection, conditionCollection, interCollection,
    widgetCollection,
  } = dsl as TypeOfIUBDSL;


  /** 临时代码 */
  const renderWidgetIds = Object.keys(widgetCollection);

  /** 数据源元数据解析和实体 */
  const interMetaEntity = interMetaManage(interMetaCollection);
  /** 页面模型解析 */
  const schemaParseRes = schemaParser(schema);
  /** 每个动作解析成函数「流程将其连起来」 */
  const actionParseRes = actionsCollectionParser(actionsCollection);
  /** widget的解析 */
  const widgetParseRes = widgetParser(widgetCollection);
  /** 流程解析 */
  const flowParseRes = flowParser(flowCollection);

  // const { getFlowItemInfo } = flowParseRes;
  // const { flowItemRun } = getFlowItemInfo('flow1');
  // console.log(flowItemRun({
  //   getFlowItemInfo
  // })?.then());

  /**
   * hub Parser
   */
  const ref2ValueParseRes = ref2ValueParser();
  const condParseRes = conditionParser(conditionCollection || {});
  // const interParseRes = interParser(interCollection || {});
  const APIReqParseRes = APIReqParser({});

  const parseRes = {
    ...pickObj(dsl, pickKeys),
    flowParseRes,
    widgetParseRes,
    getWidgetParseInfo: (widgetId: string) => widgetParseRes[widgetId],
    interMetaEntity,
    schemaParseRes,
    actionParseRes,
    renderWidgetIds,
    /** hub */
    ref2ValueParseRes,
    condParseRes,
    APIReqParseRes
  };

  console.log(parseRes);

  /**  
   * 注意: 都是引用改变, 不改变结构Key, 可以扩展更多key
   */
  IUBDSLExtral(parseRes);

  return parseRes;
};

export default IUBDSLParser;
