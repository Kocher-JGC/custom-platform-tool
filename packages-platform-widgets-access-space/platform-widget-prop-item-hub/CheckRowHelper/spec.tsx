import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { CheckRowComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';
@PropItem({
  id: 'prop_check_row',
  label: '选中数据行',
  whichAttr: ['rowCheckType', 'checkedRowsStyle'],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class CheckRowSpec {
  render(ctx: PropItemRenderContext) {
    const {
      changeEntityState,
      editingWidgetState
    } = ctx;
    const handleChange = (attr, value) => {
      changeEntityState({
        attr, value
      });
    };
    return (
      <CheckRowComp onChange = {handleChange} editingWidgetState = {editingWidgetState} />
    );
  }
}
