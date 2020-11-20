import React, { useEffect } from 'react';
// import { Input } from '@infra/ui';
import { InputNumber } from 'antd';

export const NumberMaxComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { max, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    const nextMax = selectedField?.column?.name;
    if (!nextMax) return;
    changeEntityState({
      attr: 'max',
      value: nextMax
    });
  }, [selectedField]);
  return (
    <InputNumber
      value={max}
      onChange={(value) => changeEntityState({
        attr: 'max',
        value
      })}
    />
  );
};
