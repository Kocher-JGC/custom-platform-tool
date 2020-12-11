import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { StartSearchComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';

@PropItem({
  id: 'prop_start_search',
  label: '启动搜索',
  whichAttr: ['startSearch', 'field'],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class StartSearchHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;
    return (
      <StartSearchComp {...ctx} takeMeta={takeMeta} />
    );
  }
}
