import React, { useEffect } from 'react';
import { Input } from '@infra/ui';
import { PropItemRenderContext } from '@platform-widget-access/spec';

export const UnitEditorComp: React.FC<PropItemRenderContext> = ({
  changeEntityState,
  editingWidgetState,
  platformCtx: {
    meta: {
      takeMeta
    }
  }
}) => {
  const { unit, field } = editingWidgetState;
  // const selectedField = takeMeta({
  //   metaAttr: 'schema',
  //   metaRefID: field
  // });
  useEffect(() => {
    // const nextTitle = selectedField?.column?.name;
    // if (!nextTitle || nextTitle === title) return;
    // changeEntityState({
    //   attr: 'title',
    //   value: nextTitle
    // });
  }, [field]);
  return (
    <Input
      value={unit || ''}
      onChange={(value) => changeEntityState({
        attr: 'unit',
        value
      })}
    />
  );
};
