import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { PageSizeComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';
const attr = 'pageSize';
@PropItem({
  id: 'prop_page_size',
  label: '显示分页',
  whichAttr: [attr],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class PageSizeSpec {
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
      <PageSizeComp onChange = {handleChange} editingWidgetState = {editingWidgetState} />
    );
  }
}
