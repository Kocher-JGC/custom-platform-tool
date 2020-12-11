import { TransfromCtx } from "../../types/types";
import { flowMark } from "../IUBDSL-mark";

export const defaultGen = (transfromCtx: TransfromCtx, { id, widgetRef, propState }) => {
  const { widgetCode } = propState;
  const { 
    extralDsl: { tempAction, tempFlow, tempSchema }
  } = transfromCtx;

  return {
    widgetId: id, widgetRef, propState, widgetCode
  };
};

/**
 * IUBDSL 事件 flowEventHandler的模版
 * @param flowItemIds 流程项ids
 */
export const flowEventHandlerTemplate = (flowItemIds: string[]) => ({
  type: "flowEventHandler",
  /** 引用的子流程的id */
  flowItemIds: flowItemIds.map(str => flowMark + str) // string[]
  /** 引用的页面，如果没有，则代表当前页 */
  // pageID: 'string',
});

/**
 * 默认的事件生成
 * @param eventRef 配置平台的事件引用
 */
export const defaultGenEvents = (eventRef: {[key:string]: string[]}) => {
  const eventsKey = eventRef && Object.keys(eventRef) || [];
  return eventsKey.reduce((res, key) => ({
    ...res,
    [key]: flowEventHandlerTemplate(eventRef[key])
  }), {});
};
