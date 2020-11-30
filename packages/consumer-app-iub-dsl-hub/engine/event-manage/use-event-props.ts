import { useMemo } from 'react';

/**
 * 生成组件绑定props
 * @param runTimeCtx 运行时上下文 用useRef缓存, 不需要对事件进行watch
 * @param eventHandlers widget的事件处理
 */
export const useEventProps = (runTimeCtx, eventHandlers) => {
  const eventProps = {};
  const eventKeys = Object.keys(eventHandlers);
  
  eventKeys.forEach((eKey) => {
    /** 缓存每个事件 用useRef缓存减少很多计算 */
    eventProps[eKey] = eventHandlers[eKey](runTimeCtx);
  });

  /** 最终用于绑定的eventList结果 */
  return useMemo(() => eventProps, []);
};
