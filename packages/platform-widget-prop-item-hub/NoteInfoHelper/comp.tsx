import React, { useEffect } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

export const NoteInfoComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { noteInfo, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    const nextNoteInfo = selectedField?.column?.name;
    if (!nextNoteInfo || nextNoteInfo === noteInfo) return;
    changeEntityState({
      attr: 'noteInfo',
      value: nextNoteInfo
    });
  }, [selectedField]);
  return (
    <TextArea
      rows={3}
      maxLength={32}
      value={noteInfo}
      onChange={(e) => changeEntityState({
        attr: 'noteInfo',
        value:  e.target.value
      })}
      showCount
    />
  );
};
