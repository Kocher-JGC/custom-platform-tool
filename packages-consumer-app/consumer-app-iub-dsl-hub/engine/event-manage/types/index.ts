import { WidgetDef } from "@iub-dsl/definition";
import { RunTimeCtxToBusiness } from "../../runtime/types";
export interface EventParserCtx {
  widgetConf: WidgetDef;
  eventType: string; // TriggerEventTypes
}

export interface BindRunFn<T = (any: any) => any> {
  (bindRunFn: T): (
    runtimeCtxRef: React.MutableRefObject<RunTimeCtxToBusiness>
  ) => (e /** 组件的event */) => any;
}


export interface NormalEventParamFn<T = any> {
  (widgetConf: WidgetDef): (e: T) => any;
}