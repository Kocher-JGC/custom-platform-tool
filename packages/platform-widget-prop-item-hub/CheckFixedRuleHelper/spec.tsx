import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { CheckFixedRuleComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';

@PropItem({
  id: 'prop_check_fixed_rule',
  name: 'PropCheckFixedRule',
  label: '固定规则',
  whichAttr: ['checkFixedRule', 'field'],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class CheckFixedRuleHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta } = ctx.platformCtx.meta;
    return (
      <CheckFixedRuleComp {...ctx} takeMeta={takeMeta} />
    );
  }
}