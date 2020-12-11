import { eventParser } from '../../event-manage';
import { isSchema } from "../../IUBDSL-mark";
import { WidgetDef } from "@iub-dsl/definition";
import { WidgetParseRes } from "../types";
import { getWidgetRender } from "./widget-parser";

/**
 * 默认的prop解析处理
 * @param originProp 配置的props
 */
const defaultWidgetPropParse = (originProp: { [str: string]: any }) => {
  const propKeys = Object.keys(originProp || {});
  const staticProps = {};
  const dynamicProps = {};
  /**
   * 根据IUBDSLMark规则， 拆分静态prop和可变prop
   */
  propKeys.forEach(key => {
    const propVal = originProp[key];
    if (isSchema(propVal)) {
      dynamicProps[key] = propVal;
    } else {
      staticProps[key] = propVal;
    }
  });
  return {
    staticProps, dynamicProps
  };
};

/**
 * 默认的widget解析函数
 * @param widgetConf widget配置
 */
export const defaultWidgetParse = (widgetConf: WidgetDef): WidgetParseRes => {
  const { widgetId, widgetCode, widgetRef, propState, eventHandlers } = widgetConf;
  const widgetRenderMeta = getWidgetRender(widgetRef);
  const { dynamicProps, staticProps } = defaultWidgetPropParse(propState);
  
  const eventParseRes = eventParser(eventHandlers || {}, { widgetConf, eventType: '' });

  return {
    widgetId,
    widgetCode,
    widgetRenderMeta,
    dynamicProps, 
    staticProps,
    ...eventParseRes
  };
};