import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { WidgetTypeComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';

@PropItem({
  id: 'prop_widget_type',
  name: 'PropWidgetType',
  label: '控件类型',
  whichAttr: ['widgetType', 'field'],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class WidgetTypeSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;
    return (
      <WidgetTypeComp {...ctx} takeMeta={takeMeta} />
    );
  }
}
