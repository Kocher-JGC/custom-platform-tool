import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { NumberMinComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';

@PropItem({
  id: 'prop_number_min',
  name: 'PropNumberMin',
  label: '最小值',
  whichAttr: ['min', 'field'],
  // defaultValues: {
  //   min: 0
  // },
})
export class NumberMinHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;

    return (
      <NumberMinComp {...ctx} takeMeta={takeMeta} />
    );
  }
}
