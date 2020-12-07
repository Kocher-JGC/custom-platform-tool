import React from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { TitlePlaceComp } from './comp';

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';
const attr = 'titlePlace';
@PropItem({
  id: 'prop_title_place',
  label: '标题位置',
  whichAttr: [attr],
  // defaultValues: {
  //   title: '标题'
  // },
})
export class TitlePlaceSpec {
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
      <TitlePlaceComp onChange = {handleChange} editingWidgetState = {editingWidgetState} />
    );
  }
}
