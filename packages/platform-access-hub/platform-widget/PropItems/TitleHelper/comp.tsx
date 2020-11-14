import React, { useEffect } from 'react';
import { Input } from '@infra/ui';

export const TitleEditorComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
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
};
