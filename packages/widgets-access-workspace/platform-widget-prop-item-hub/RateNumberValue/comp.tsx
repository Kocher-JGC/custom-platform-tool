import { InputNumber } from 'antd';
import React, { useEffect } from 'react';

export const RateNumberComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { numberVal, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    // const nextPromptInfo = selectedField?.column?.name;
    // if (!nextPromptInfo || nextPromptInfo === promptInfo) return;
    // changeEntityState({
    //   attr: 'promptInfo',
    //   value: nextPromptInfo
    // });
  }, [selectedField]);
  return (
    <InputNumber
      max={5}
      min={0}
      value={numberVal}
      onChange={(number) => changeEntityState({
        attr: 'numberVal',
        value: number
      })}
    />
  );
};
