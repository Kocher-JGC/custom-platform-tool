import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { DropdownMultipleComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';

@PropItem({
  id: 'prop_dropdown_multiple',
  label: '下拉多选',
  whichAttr: ['dropdownMultiple', 'field'],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class DropdownMultipleHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;
    return (
      <DropdownMultipleComp {...ctx} takeMeta={takeMeta} />
    );
  }
}
