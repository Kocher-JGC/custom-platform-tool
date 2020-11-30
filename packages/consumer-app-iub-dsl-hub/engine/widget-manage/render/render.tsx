import { useMemo, useContext } from 'react';
import { WidgetParseRes } from '../types';
import { DefaultCtx } from '../../runtime';
export const widgetRenderer = (conf: WidgetParseRes) => {

  const { 
    widgetCode, widgetId, widgetRenderMeta,
    staticProps, dynamicProps, eventHandlers
  } = conf;
  const { render: widgetRender } = widgetRenderMeta;

  /**
   * 真实渲染的组件
   */
  return ({ extralProps: actualExtralProps }) => {
    const { useDynamicProps, useEventProps, pageStatus } = useContext(DefaultCtx);
    const actualDynamicPros = useDynamicProps?.(dynamicProps) || {};
    
    const eventProps = useEventProps?.(eventHandlers) || {};

    // ! 全局透传的extralProps一改全改:: 谨慎
    // const actualExtralProps = useMemo(() => {
    //   return extralProps;
    // }, [extralProps]);

    const renderedComp = useMemo(() => {
      // console.count(widgetCode);

      return widgetRender({
        pageStatus,
        widgetCode, widgetId,
        ...staticProps, // 静态props
        ...actualDynamicPros, // 可变的props
        ...actualExtralProps // 额外的props
      }, eventProps);
    }, [actualDynamicPros, staticProps, actualExtralProps]);

    return renderedComp;
  };
  
};