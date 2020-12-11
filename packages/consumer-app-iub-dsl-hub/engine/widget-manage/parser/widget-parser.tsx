import React from 'react';
import { AllWidgetType, WidgetCollection, WidgetDef } from "@iub-dsl/definition";
import { getWidget } from "@platform-widget-access/loader";
import { defaultWidgetParse } from './default-widget-parser';

/**
 * 异常组件
 */
const Unexpect = ({ children = '异常组件' }) => {
  return (
    <div>{children}</div>
  );
};

/**
 * 获取用于渲染的widget
 * @param type widget类型
 */
export const getWidgetRender = (type: AllWidgetType) => {
  const widgetRenderMeta: any = getWidget(type);

  if ('unexpected' in widgetRenderMeta && widgetRenderMeta.unexpected) {
    console.error(`获取未知widget:  ${type}`);
    return {
      render: Unexpect,
    };
  }
  
  /**
   * 其他数据暂时不知道还有什么用
   */
  // return widgetRenderMeta;
  return {
    render: widgetRenderMeta.render
  };
};

/**
 * 调度各个不同的解析器解析widget
 * @param widgetConf widget配置
 */
const widgetParseScheduler = (widgetConf: WidgetDef) => {
  const pRes = defaultWidgetParse(widgetConf);
  /**
   * 特殊的额外处理， 如表格
   */
  // switch (widgetConf.widgetRef) {
  //   case AllWidgetType.DropdownSelector:
  //     break;
  //   default:
  //     break;
  // }
  return pRes;
};

/**
 * widget解析器
 * @param widgetC widget配置集合
 */
export const widgetParser = (widgetC: WidgetCollection) => {
  const widgetIds = Object.keys(widgetC);

  const widgetPRes = {};

  widgetIds.forEach((id) => {
    const widgetConf = widgetC[id];
    const pRes = widgetParseScheduler(widgetConf);
    widgetPRes[id] = pRes;
  });

  return widgetPRes;
};