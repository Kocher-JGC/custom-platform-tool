import React, { useEffect } from 'react';
import { InputNumber } from 'antd';

export const StringLengthComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { stringLength, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    // const nextStringLength = selectedField?.column?.name;
    // if (!nextStringLength || nextStringLength === stringLength) return;
    // changeEntityState({
    //   attr: 'stringLength',
    //   value: nextStringLength
    // });
  }, [selectedField]);
  return (
    <InputNumber
      value={stringLength}
      style={{ width: "100%" }}
      onChange={(value) => changeEntityState({
        attr: 'stringLength',
        value
      })}
    />
  );
};
