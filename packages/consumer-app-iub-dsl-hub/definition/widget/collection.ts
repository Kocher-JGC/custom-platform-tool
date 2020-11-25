import { AllWidgetType } from "./widgets";
import { WidgetEvents } from "../events";

/**
 * 组件元素，行为载体
 */
export interface WidgetDef {
  id: string;
  /** UI隔离的唯一引用标识 */
  widgetRef: AllWidgetType;
  /** widget唯一编码 */
  widgetCode: string;
  // type: "component";
  /**
   * 组件触发的事件定义
  */
  eventHandlers?: WidgetEvents;
  /** Widget的prop定义 */
  propState: any;
}

export interface WidgetCollection {
  [componentID: string]: WidgetDef;
}