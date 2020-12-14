import { AllWidgetType, TriggerEventTypes } from "@iub-dsl/definition";
import { defaultNormal, defaultOnClick, defaultOnChange, genEventBaseConf } from "./default-normal-of-event";
import { NormalEventParamFn } from "../types";

type EventType = TriggerEventTypes & 'onTableSelect'

/** 默认的标准化事件的函数 */
const defaultNormalEventFn: { [k in EventType] } = {
  onChange: defaultOnChange,
  onClick: defaultOnClick,
  onFocus: defaultNormal,
  onMount: defaultNormal,
  onTap: defaultNormal,
  onUnmount: defaultNormal,
  onTableSelect: (
    /** widget配置 */
    widgetConf
  ) => (e) => {
    const {selectedRowKeys, selectedRows} = e
    return {
      ...genEventBaseConf(widgetConf),
      payload: {selectedRows, selectedRowKeys},
      type: 'onTableSelectNormal'
    }
  }
};

/**
 * 获取标准化事件参数的函数
 * @param widgetType wideget类型
 * @param eventType 事件类型
 */
export const getNormalEventParamFn = (widgetType: AllWidgetType, eventType: TriggerEventTypes) => {
  const normalFn: NormalEventParamFn = defaultNormalEventFn[eventType] || defaultNormal;
  
  /** widget特殊的处理 */

  return normalFn;
};