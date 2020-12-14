import { TypeOfIUBDSL } from "@iub-dsl/definition";
/** dont Overengineering */
import { schemaParser } from "./state-manage";
import { flowParser, flowExtraParser } from './flow-engine';
import { interMetaManage } from "./inter-meta-manage";
import { widgetParser } from "./widget-manage";
import { noopError, pickObj } from "./utils";
import { ref2ValueParser, conditionParser, APIReqParser } from "./hub";
import { actionExtralParser, actionsCollectionParser } from "./actions-manage";

/**
 * 1. 额外解析, 添加额外的业务处理逻辑
 * 2. 绑定其他的处理函数 「绑定函数的时候, 应该把模块需要的插件传入」
 */
const demoParser = () => { /** 解析器 */
  return (plugins?) => { /** 扩展解析、绑定时候函数时传入的运行时需要使用的插件 */
    return (ctx) => { /** 运行时真实的函数 */
    };
  };
};
const xxxlist = {};
/**
 * 绑定解析完成的函数
 * @param mark 用于绑定的唯一标示
 * @param plugins 运行时需要的插件「也支持运行时动态获取插件」
 */
const demoBindFn = (mark, plugins?) => {
  let fn = xxxlist[mark];
  /** 绑定时进行扩展解析 */
  fn = fn(plugins);
  return (ctx) => {
    /** 也可以在运行时候ctx, 获取插件 */
    return fn(plugins)(ctx);
  };
};

/**
 * 几种主要运行流程的情况 「TODO: 还未优化至这种情况」
 * parser --> extralParser{plugins「parse+run」} --> runFn「runPlguins」「预解析、组合解析、绑定/使用、运行」
 * 1. 先解析, 统一进行extralParser, runFn
 * 2. 先解析, (bind)绑定时extralParser,  runFn
 * 3. 直接bind, 解析 + runFn
 * 4. 直接运行  (parse+run)
 */

/**
 * 不推荐使用的默认解析
 */
export const defaultExtralParser = (any) => any;

const pickKeys = ['layoutContent', 'pageID', 'name', 'type', 'isSearch', 'businessCode', 'openPageUrl', 'pkSchemaRef'];
/**
 * 扩展解析
 * 1. 公共依赖 + 依赖分析
 * 2. 动作 + 依赖分析
 * 3. 流程 「注入动作+条件」
 * 4. 事件 「注入流程函数」
 */

const IUBDSLExtraParser = (parseRes) => {
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

  /** 流程的额外解析 */
  flowExtraParser(parseRes);
  /** 动作的额外解析 */
  actionExtralParser(parseRes);

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

/**
 * IUBDSL 解析器
 * @param param0 DSL
 */
const IUBDSLParser = ({ dsl }) => {
  
  const {
    schema, interMetaCollection,
    actionsCollection, flowCollection,
    ref2ValCollection, conditionCollection,
    widgetCollection, APIReqCollection,
    pageLifecycle
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

  /**
   * hub Parser
   */
  const ref2ValueParseRes = ref2ValueParser(ref2ValCollection || {});
  const condParseRes = conditionParser(conditionCollection || {});
  const APIReqParseRes = APIReqParser(APIReqCollection || {});

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
    APIReqParseRes,
    pageLifecycle
  };

  console.log(parseRes);

  /**  
   * 注意: 都是引用改变, 不改变结构Key, 可以扩展更多key
   */
  IUBDSLExtraParser(parseRes);

  return parseRes;
};

export default IUBDSLParser;
