import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import React from 'react';
import { RateNumberComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'promptInfo';

@PropItem({
  id: 'rate-number-value',
  label: '评分值',
  whichAttr: ['numberVal', 'field'],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class RateNumberValueSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;
    return (
      <RateNumberComp {...ctx} takeMeta={takeMeta} />
    );
  }
}
