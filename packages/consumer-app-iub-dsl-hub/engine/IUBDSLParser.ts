import { TypeOfIUBDSL } from "@iub-dsl/definition";
/** dont Overengineering */
import { schemaParser } from "./state-manage";
// import widgetParser from "./component-manage/widget-parser";
import { actionsCollectionParser } from "./actions-manage/actions-parser";
import { flowParser } from './flow-engine';
import { interMetaManage } from "./inter-meta-manage";
import { widgetParser } from "./widget-manage";
import { noopError } from "./utils";
import { ref2ValueParser, conditionParser, interParser } from "./hub";

/**
 * 不推荐使用的默认解析
 */
export const defaultExtralParser = (any) => any;

const noopTrueFn = () => true;

const pickObj = (obj, keys: string[]) => {
  return keys.reduce((res, k) => ({ ...res, [k]: obj[k] }), {});
};

const pickKeys = ['layoutContent', 'pageID', 'name', 'type', 'isSearch', 'businessCode', 'openPageUrl'];
/**
 * 扩展解析
 * 1. 公共依赖 + 依赖分析
 * 2. 动作 + 依赖分析
 * 3. 流程 「注入动作+条件」
 * 4. 事件 「注入流程函数」
 */

const composeParser = (parseRes) => {
  const { 
    actionParseRes, widgetParseRes,
    flowParseRes, ref2ValueParseRes: { bindRef2Value }
  } = parseRes;

  const { actionIds, actionList, bindAction } = actionParseRes;

  const { flowIds, flowItemList, bindFlows, bindFlow } = flowParseRes;

  /** AOP */
  const actionExtralParser = (conf) => {
    console.log(conf);
    const { actionBaseConf, actionOpts } = conf;
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
  actionIds.forEach(actId => {
    const actionFnWrap = actionList[actId];
    actionList[actId] = actionFnWrap(actionExtralParser);
  });

  /** 所有flow的额外的解析 */
  flowIds.forEach(actId => {
    const flowFnWrap = flowItemList[actId];
    flowItemList[actId] = flowFnWrap(flowExtralParser);
  });

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
        eventHandlers[eKey] = noopError;
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

  let parseRes: any = pickObj(dsl, pickKeys);

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
  const ref2ValueParseRes = ref2ValueParser(ref2ValueCollection || {});
  const conditionParseRes = conditionParser(conditionCollection || {});
  const interParseRes = interParser(interCollection || {});
  

  parseRes = {
    ...parseRes,
    flowParseRes,
    widgetParseRes,
    getWidgetParseInfo: (widgetId: string) => widgetParseRes[widgetId],
    interMetaEntity,
    schemaParseRes,
    actionParseRes,
    ref2ValueParseRes,
    renderWidgetIds,
    // getCompParseInfo: (compId) => componentParseRes[compId]
  };

  console.log(parseRes);

  /**  
   * 注意: 都是引用改变, 不改变结构Key, 可以扩展更多key
   */
  composeParser(parseRes);

  return parseRes;
};

export default IUBDSLParser;
