import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { FieldEllipsisComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';
const attr = 'fieldEllipsis';
@PropItem({
  id: 'prop_field_ellipsis',
  label: '单元格换行显示',
  whichAttr: [attr],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class FieldEllipsisSpec {
  render(ctx: PropItemRenderContext) {
    const {
      changeEntityState,
      editingWidgetState
    } = ctx;
    const handleChange = (value) => {
      changeEntityState({
        attr, value
      });
    };
    return (
      <FieldEllipsisComp onChange = {handleChange} editingWidgetState = {editingWidgetState} />
    );
  }
}
