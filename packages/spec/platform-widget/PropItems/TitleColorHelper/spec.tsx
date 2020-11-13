import React from 'react';
import { Input, Selector } from '@infra/ui';
import { PropItemRenderContext } from '@engine/visual-editor/data-structure';
import { PropItem } from '../../core';

/** 属性项编辑的组件属性 */
const whichAttr = 'labelColor';

@PropItem({
  id: 'prop_style_title_color',
  name: 'PropLabelColor',
  label: '标题颜色',
  whichAttr,
})
export class TitleColorHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { changeEntityState, editingWidgetState } = ctx;
    /** 取自身定义的 whichAttr */
    const _value = editingWidgetState[whichAttr];
    return (
      <div>
        <Input
          value={_value || ''}
          onChange={(value) => changeEntityState({
            attr: whichAttr,
            value
          })}
        />
      </div>
    );
  }
}
