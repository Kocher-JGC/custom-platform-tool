import { WidgetEvents, ActionTypeDef, FlowRefType, TriggerEventTypes } from "@iub-dsl/definition";
import { RunTimeCtxToBusiness } from "../runtime/types";
import { EventParserCtx, BindRunFn } from "./types";
import { getNormalEventParamFn } from "./normal-event-param";

/**
 * 事件运行体（fn）的包装函数
 * @param 必要的运行参数
 */
const eventRunWrapFn = ({
  normalEventParamFn,
  eventHandlerFn
}) => (
  /** 传入运行上下文 */
  runtimeCtxRef: React.MutableRefObject<RunTimeCtxToBusiness>
) => (e) => { // 组件的事件触发
  /** 标准化事件的参数 */
  const eventParam = normalEventParamFn(e);
  /** 取出useRef的缓存引用 */
  const runtimeCtx = runtimeCtxRef.current;
  const eventContext = {
    action: eventParam,
    ...runtimeCtx
  };
  /** 触发标准的事件, 传入上下文, 需要create不然第一次动作将丢失 */
  eventHandlerFn(Object.create(eventContext));
};

/**
 * @(flow). 的配置的事件的解析
 * @param conf 配置
 * @param ctx 事件解析需要的上下文
 */
const flowEventParser = (conf: FlowRefType, ctx: EventParserCtx): BindRunFn => {
  // const { flowItemIds, pageID /** 跨页面扩展 */ } = conf;
  const { widgetConf, eventType } = ctx;

  /**
   * 获取标准事件参数的函数， 并传入widget配置
   */
  const normalEventParamFn = getNormalEventParamFn(widgetConf.widgetRef, eventType as TriggerEventTypes)(widgetConf);

  /** 扩展的事件解析 */
  return (eventExtralParser) => {
    /** 获取真实运行的函数 */
    const eventHandlerFn = eventExtralParser(conf);

    /** 包装参数 */
    return eventRunWrapFn({ normalEventParamFn, eventHandlerFn }); 
  };
};

/**
 * 事件解析器
 * @param wE 事件配置
 * @param ctx 事件解析需要的上下文
 */
export const eventParser = (wE: WidgetEvents, ctx: EventParserCtx) => {
  const eventKeys = Object.keys(wE);
  const eventHandlers = {};

  eventKeys.forEach((eKey) => {
    const eConf: ActionTypeDef = wE[eKey];
    ctx.eventType = eKey;

    switch (eConf.type) {
      case 'flowEventHandler':
        eventHandlers[eKey] = flowEventParser(eConf, ctx);
        break;
      case 'direct':
      default:
        eventHandlers[eKey] = typeof eConf.func === 'function' ? eConf.func : () => { 
          // console.error(`未知事件类型！:  ${eConf.type}`); 
        };
        break;
    }
  });
  
  return { eventHandlers, eventKeys };
};
