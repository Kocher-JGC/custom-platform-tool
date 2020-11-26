import { TypeOfIUBDSL } from "@iub-dsl/definition";
/** dont Overengineering */

import { schemaParser } from "./state-manage";
// import widgetParser from "./component-manage/widget-parser";
import { actionsCollectionParser } from "./actions-manage/actions-parser";
import { flowParser } from './flow-engine';
import { eventPropsHandle } from "./event-manage";
import { actionsCollectConstor } from "./relationship/depend-collet/action-depend";
import { interMetaManage } from "./inter-meta-manage";
import { widgetParser } from "./widget-manage";
import { isSchema } from "./IUBDSL-mark";

const genIUBDSLParserCtx = (parseRes) => {
  /** param: 内部暴露功能或参数到外部 */
  const propsParser = (originHandle, ctx?) => {
    const { getStructItemInfo } = ctx;
    return (key, conf) => {
      let tempRes;
      if (isSchema(conf)) {
        return {
          type: 'dynamicProps',
          result: originHandle(key, conf),
          deps: [conf]
        };
      }

      if ((
        // 需要递归
        tempRes = eventPropsHandle(key, conf, {
          compTag: getStructItemInfo('compTag')
        })
      )) {
        return tempRes;
      }

      return originHandle(key, conf);
    };
  };

  const actionConfParser = (actionConf, actionConfParseRes, parseContext) => {
    return actionConfParseRes;
  };
  const {
    actionDependCollect,
    flowToUseCollect,
    findEquMetadata
  } = actionsCollectConstor();
  return {
    propsParser,
    actionConfParser,
    actionDependCollect,
    flowToUseCollect,
    findEquMetadata,
  };
};

const IUBDSLParser = ({ dsl }) => {
  console.log(dsl);
  
  const {
    interMetaCollection,
    actionsCollection,
    widgetCollection, schema,
    layoutContent, pageID, name, type,
    flowCollection, openPageUrl, isSearch,
    businessCode
  } = dsl as TypeOfIUBDSL;

  let parseRes: any = {
    layoutContent,
    pageID,
    name,
    type,
    schema,
    isSearch,
    businessCode
  };

  /** TODO: 有问题 */
  const parseContext = genIUBDSLParserCtx(parseRes);

  const renderWidgetIds = Object.keys(widgetCollection);

  /** 数据源元数据解析和实体 */
  const interMetaEntity = interMetaManage(interMetaCollection);
  

  /** 页面模型解析 */
  const schemasParseRes = schemaParser(schema);
  
  /** 每个动作解析成函数「流程将其连起来」 */
  // const actionParseRes = actionsCollectionParser(Object.assign(actionsCollection, tableExtralAction), parseContext);

  parseRes = {
    ...parseRes,
    findEquMetadata: parseContext.findEquMetadata,
    // schemasParseRes,
    // interMetaEntity,
    // actionParseRes
  };

  /**
   * 组件的解析
   */
  const widgetParseRes = widgetParser(widgetCollection);

  /** 组件解析 TODO: propsMap有问题, 上下文没有对其进行干预 */
  // const componentParseRes = widgetParser(widgetCollection, {
  //   parseContext,
  //   openPageUrl
  // });

  // const flowParseRes = flowParser(Object.assign(flowCollection, tableExtralFlow), { parseContext, parseRes });
  // const { getFlowItemInfo } = flowParseRes;
  // const { flowItemRun } = getFlowItemInfo('flow1');
  // console.log(flowItemRun({
  //   getFlowItemInfo
  // })?.then());
  

  parseRes = {
    ...parseRes,
    // ...flowParseRes,
    widgetParseRes,
    getWidgetParseInfo: (widgetId: string) => widgetParseRes[widgetId],
    // componentParseRes,
    renderWidgetIds,
    // getCompParseInfo: (compId) => componentParseRes[compId]
  };

  console.log(parseRes);

  return parseRes;
};

export default IUBDSLParser;
