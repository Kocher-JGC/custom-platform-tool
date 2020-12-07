import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { NumberRadixPointComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';

@PropItem({
  id: 'prop_number_radixPoint',
  label: '小数位数',
  whichAttr: ['radixPoint', 'field'],
  // defaultValues: {
  //   radixPoint: 0
  // },
})
export class NumberRadixPointHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;

    return (
      <NumberRadixPointComp {...ctx} takeMeta={takeMeta} />
    );
  }
}
