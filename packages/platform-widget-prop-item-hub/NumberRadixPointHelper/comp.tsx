import React, { useEffect } from 'react';
// import { Input } from '@infra/ui';
import { InputNumber } from 'antd';

export const NumberRadixPointComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { radixPoint, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    // const nextRadixPoint = selectedField?.column?.name;
    // if (!nextRadixPoint) return;
    // changeEntityState({
    //   attr: 'radixPoint',
    //   value: nextRadixPoint
    // });
  }, [selectedField]);
  return (
    <InputNumber
      min={0}
      value={radixPoint}
      style={{ width: "100%" }}
      onChange={(value) => changeEntityState({
        attr: 'radixPoint',
        value
      })}
    />
  );
};
