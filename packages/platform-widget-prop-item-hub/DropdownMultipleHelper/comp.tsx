import React, { useEffect } from 'react';
import { Radio } from 'antd';

export const DropdownMultipleComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { dropdownMultiple, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    const nextDropdownMultiple = selectedField?.column?.name;
    if (!nextDropdownMultiple || nextDropdownMultiple === dropdownMultiple) return;
    changeEntityState({
      attr: 'dropdownMultiple',
      value: nextDropdownMultiple
    });
  }, [selectedField]);
  return (
    <Radio.Group
      onChange={(e)=>changeEntityState({
        attr: 'dropdownMultiple',
        value: e.target.value
      })} value={dropdownMultiple}
    >
      <Radio value={true}>是</Radio>
      <Radio value={false}>否</Radio>
    </Radio.Group>
  );
};
