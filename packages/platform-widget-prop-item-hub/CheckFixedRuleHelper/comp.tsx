import React, { useEffect } from 'react';
import { Select } from 'antd';
import { FIELD_TYPE_MENU } from './constants';

const { Option } = Select;


export const CheckFixedRuleComp = ({
  changeEntityState,
  editingWidgetState,
  takeMeta
}) => {
  const { checkFixedRule, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  useEffect(() => {
    const nextCheckFixedRule = selectedField?.column?.name;
    if (!nextCheckFixedRule || nextCheckFixedRule === checkFixedRule) return;
    changeEntityState({
      attr: 'checkFixedRule',
      value: nextCheckFixedRule
    });
  }, [selectedField]);
  return (
    <Select
      style={{ width: "100%" }}
      value={checkFixedRule} onChange={(value) => changeEntityState({
        attr: 'checkFixedRule',
        value
      })}
      allowClear
    >
      {FIELD_TYPE_MENU.map((item)=><Option key={item.value} value={item.value}>{item.label}</Option>)}
    </Select>
  );
};
