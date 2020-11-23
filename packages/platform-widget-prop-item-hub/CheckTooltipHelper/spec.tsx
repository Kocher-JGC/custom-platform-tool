import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { CheckTooltipComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';

@PropItem({
  id: 'prop_check_tooltip',
  name: 'PropCheckTooltip',
  label: '失败提示',
  whichAttr: ['checkTooltip', 'field'],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class CheckTooltipHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;
    return (
      <CheckTooltipComp {...ctx} takeMeta={takeMeta} />
    );
  }
}
