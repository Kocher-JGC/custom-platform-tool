import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { NumberMaxComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';

@PropItem({
  id: 'prop_number_max',
  name: 'PropNumberMax',
  label: '最大值',
  whichAttr: ['max', 'field'],
  // defaultValues: {
  //   max: 10
  // },
})
export class NumberMaxHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;
    return (
      <NumberMaxComp {...ctx} takeMeta={takeMeta} />
    );
  }
}
