import React, { useEffect } from 'react';
import { Input, Selector } from '@infra/ui';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

/** 属性项编辑的组件属性 */
const whichAttr = 'title';

export const TitleHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_title_value',
  name: 'PropTitle',
  label: '标题',
  whichAttr: ['title', 'field'],
  defaultValues: {
    title: '标题'
  },
  render(ctx) {
    const { changeEntityState, editingWidgetState, takeMeta } = ctx;
    const { title, field } = editingWidgetState;
    const selectedField = takeMeta({
      metaAttr: 'schema',
      metaRefID: field
    });
    useEffect(() => {
      const nextTitle = selectedField?.column?.name;
      if (!nextTitle) return;
      changeEntityState({
        attr: 'title',
        value: nextTitle
      });
    }, [selectedField]);
    return (
      <div>
        <Input
          value={title || ''}
          onChange={(value) => changeEntityState({
            attr: 'title',
            value
          })}
        />
      </div>
    );
  }
};
