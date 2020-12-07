import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { StringLengthComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';

@PropItem({
  id: 'prop_string_length',
  label: '字符长度',
  whichAttr: ['stringLength', 'field']
})
export class StringLengthSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;
    return (
      <StringLengthComp {...ctx} takeMeta={takeMeta} />
    );
  }
}
