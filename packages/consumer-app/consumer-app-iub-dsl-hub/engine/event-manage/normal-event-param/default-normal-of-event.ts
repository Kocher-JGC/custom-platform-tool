import { WidgetDef } from '@iub-dsl/definition';

/**
 * 生成默认的事件参数配置
 * @param widgetConf widget配置
 */
export const genEventBaseConf = (widgetConf: WidgetDef) => ({
  widgetCode: widgetConf.widgetCode,
  widgetId: widgetConf.widgetId,
  widgetRef: widgetConf.widgetRef,
});


/**
 * 默认的onChange的normalParam
 * @param widgetConf widget配置
 */
export const defaultOnChange = (
  /** widget配置 */
  widgetConf: WidgetDef
) => (
  // 事件起点
  e: React.ChangeEvent<HTMLInputElement>
) => ({
  ...genEventBaseConf(widgetConf),
  type: 'defaultOnChange',
  payload: e.target.value,
});

/**
 * 默认的onClick的normalParam
 * @param widgetConf widget配置
 */
export const defaultOnClick = (
  /** widget配置 */
  widgetConf: WidgetDef
) => (
  e: React.MouseEventHandler<HTMLElement>
) => ({
  ...genEventBaseConf(widgetConf),
  action: { type: 'click' },
  type: 'defaultOnClick'
});


/**
 * 默认的normalParam
 * @param widgetConf widget配置
 */
export const defaultNormal = (
  /** widget配置 */
  widgetConf: WidgetDef
) => (e) => ({
  ...genEventBaseConf(widgetConf),
  action: e,
  type: 'defaultNormal'
});
