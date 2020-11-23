import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { PromptInfoComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'promptInfo';

@PropItem({
  id: 'prop_prompt_info',
  name: 'PropPromptInfo',
  label: '提示信息',
  whichAttr: ['promptInfo', 'field'],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class PromptInfoHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;
    return (
      <PromptInfoComp {...ctx} takeMeta={takeMeta} />
    );
  }
}
