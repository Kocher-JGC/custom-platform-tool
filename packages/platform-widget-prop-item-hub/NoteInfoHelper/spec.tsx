import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { NoteInfoComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'noteInfo';

@PropItem({
  id: 'prop_note_info',
  label: '备注信息',
  whichAttr: ['noteInfo', 'field'],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class NoteInfoHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;
    return (
      <NoteInfoComp {...ctx} takeMeta={takeMeta} />
    );
  }
}
