import React, { useEffect } from 'react';
import { Input } from 'antd';

export const CheckTooltipComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { checkTooltip, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    const nextCheckTooltip = selectedField?.column?.name;
    if (!nextCheckTooltip || nextCheckTooltip === checkTooltip) return;
    changeEntityState({
      attr: 'checkTooltip',
      value: nextCheckTooltip
    });
  }, [selectedField]);
  return (
    <Input
      style={{ width:"100%" }}
      value={checkTooltip || ''}
      onChange={(value) => changeEntityState({
        attr: 'checkTooltip',
        value
      })}
    />
  );
};
