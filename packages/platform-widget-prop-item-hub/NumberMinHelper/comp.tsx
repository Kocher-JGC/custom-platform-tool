import React, { useEffect } from 'react';
// import { Input } from '@infra/ui';
import { InputNumber } from 'antd';

export const NumberMinComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { min, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    const nextMin = selectedField?.column?.name;
    if (!nextMin) return;
    changeEntityState({
      attr: 'min',
      value: nextMin
    });
  }, [selectedField]);
  return (
    <InputNumber
      value={min}
      onChange={(value) => changeEntityState({
        attr: 'min',
        value
      })}
    />
  );
};
