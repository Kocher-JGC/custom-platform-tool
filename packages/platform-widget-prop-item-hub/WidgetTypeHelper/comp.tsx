import React, { useEffect } from 'react';
import { Select } from 'antd';
import { FIELD_TYPE_MENU } from './constants';

const { Option }=Select;

export const WidgetTypeComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { widgetType, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    const nextWidgetType = selectedField?.column?.name;
    if (!nextWidgetType || nextWidgetType === widgetType) return;
    changeEntityState({
      attr: 'widgetType',
      value: nextWidgetType
    });
  }, [selectedField]);
  return (
    <Select
      style={{ width: "100%" }}
      value={widgetType} onChange={(value) => changeEntityState({
        attr: 'widgetType',
        value
      })}
    >
      {FIELD_TYPE_MENU.map((item)=><Option value={item.value} disabled={!item.value}>{item.label}</Option>)}
    </Select>
  );
};
