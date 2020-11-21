import React, { useEffect } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

export const PromptInfoComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { promptInfo, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    const nextPromptInfo = selectedField?.column?.name;
    if (!nextPromptInfo || nextPromptInfo === promptInfo) return;
    changeEntityState({
      attr: 'promptInfo',
      value: nextPromptInfo
    });
  }, [selectedField]);
  return (
    <TextArea
      rows={3}
      maxLength={32}
      value={promptInfo}
      onChange={(e) => changeEntityState({
        attr: 'promptInfo',
        value: e.target.value
      })}
      showCount
    />
  );
};
