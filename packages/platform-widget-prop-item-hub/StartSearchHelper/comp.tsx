import React, { useEffect } from 'react';
import { Radio } from 'antd';

export const StartSearchComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { startSearch, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    const nextStartSearch = selectedField?.column?.name;
    if (!nextStartSearch || nextStartSearch === startSearch) return;
    changeEntityState({
      attr: 'startSearch',
      value: nextStartSearch
    });
  }, [selectedField]);
  return (
    <Radio.Group
      onChange={(e)=>changeEntityState({
        attr: 'startSearch',
        value: e.target.value
      })} value={startSearch}
    >
      <Radio value={true}>是</Radio>
      <Radio value={false}>否</Radio>
    </Radio.Group>
  );
};
