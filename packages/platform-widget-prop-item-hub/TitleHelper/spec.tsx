import React, { useEffect } from 'react';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { TitleEditorComp } from './comp';

/** 属性项编辑的组件属性 */
const whichAttr = 'title';

@PropItem({
  id: 'prop_title_value',
  name: 'PropTitle',
  label: '标题',
  whichAttr: ['title', 'field'],
  defaultValues: {
    title: '标题'
  },
})
export class TitleHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { takeMeta, changeWidgetType } = ctx.platformCtx.meta;
    return (
      <>
        {/* <div onClick={e => {
          changeWidgetType('DropdownSelector');
        }}
        >
        更改为下拉框类型
        </div> */}
        <TitleEditorComp {...ctx} takeMeta={takeMeta} />
      </>
    );
  }
}
