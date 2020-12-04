import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { UnitEditorComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'unit';

@PropItem({
  id: 'prop_unit_value',
  label: '单位',
  whichAttr: ['unit', 'field'],
  // defaultValues: {
  //   unit: '标题'
  // },
})
export class UnitHelperSpec {
  render(ctx: PropItemRenderContext) {
    return (
      <UnitEditorComp {...ctx} />
    );
  }
}
