import React from 'react';
import { Input, Selector } from '@infra/ui';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

export const TitleHelperSpec: PropItemCompAccessSpec = () => ({
  id: 'prop_title_value',

  label: '标题',

  whichAttr: ['title'],

  defaultValues: {
    title: '输入框标题'
  },

  render(ctx) {
    const { changeEntityState, widgetEntityState } = ctx;
    /** 取自身定义的 whichAttr */
    let _value = widgetEntityState.title;
    if (_value === null) _value = '';
    return (
      <div>
        <Input
          value={_value}
          onChange={(value) => changeEntityState({
            attr: 'title',
            value
          })}
        />
      </div>
    );
  }
});
