import React from 'react';
import { AllWidgetType, WidgetCollection, WidgetDef } from "@iub-dsl/definition";
import { PlatformWidgetMeta, BusinessWidgetRender } from '@platform-widget-access/spec';
import { getWidget } from "@platform-widget-access/loader";

export const Unexpect = ({ children = '异常组件' }) => {
  return (
    <div>{children}</div>
  );
};

const getWidgetRender = (type: AllWidgetType) => {
  const platformWidgetInfo: any = getWidget(type);
  const widgetRender: BusinessWidgetRender = platformWidgetInfo.render || Unexpect;
  console.log(platformWidgetInfo);

  if ('unexpected' in platformWidgetInfo && platformWidgetInfo.unexpected) {
    console.error(`获取未知widget:  ${type}`);
  }
  
  return widgetRender;
};

const defaultWidgetPropParse = (originProp) => {
  return {
    staticProps: originProp,
    dynamicProps: {}
  };
};

const defaultWidgetParse = (widgetConf: WidgetDef) => {
  const { widgetId, widgetCode, widgetRef, propState, eventHandlers } = widgetConf;
  const widgetRender = getWidgetRender(widgetRef);
  const { dynamicProps, staticProps } = defaultWidgetPropParse(propState);

  return {
    widgetId,
    widgetCode,
    widgetRender,
    dynamicProps, staticProps
    // eventHandlers
  };
};

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