import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { ShowOrderColumnComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';
const attr = 'showOrderColumn';
@PropItem({
  id: 'prop_show_order_column',
  label: '显示序列号',
  whichAttr: [attr],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class ShowOrderColumnSpec {
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
      <ShowOrderColumnComp onChange = {handleChange} editingWidgetState = {editingWidgetState} />
    );
  }
}
