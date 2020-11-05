import React, { useState } from 'react';
import { Radio } from 'antd';
import { PropItemRenderContext } from '@engine/visual-editor/data-structure';
import { PopModelSelector } from '@infra/ui';
import { DictSelector } from './DictSelector';

interface OptionsType {
  type: 'table' | 'dict'
  tableInfo: {
    id: string
    condition
    defaultVal
    sort
  }
}

const takeTableInfo = (_tableInfo: OptionsType['tableInfo']) => {
  return _tableInfo.defaultVal;
};

export const OptionsSelector = (props: PropItemRenderContext) => {
  const {
    changeEntityState,
    changeMetadata,
    takeMeta,
    genMetaRefID,
    editingWidgetState,
    widgetEntity,
    businessPayload,
  } = props;
  const { interDatasources, $services } = businessPayload;
  const { options } = editingWidgetState as {options: OptionsType};
  const datasourceMeta = takeMeta({
    metaAttr: 'dataSource',
    metaRefID: ''
  });
  const [optionType, setOptionType] = useState(options?.type || 'dict');
  return (
    <div>
      <div className="py-2">
        <Radio.Group
          onChange={(e) => {
            setOptionType(e.target.value);
          }}
          value={optionType}
        >
          <Radio value={'table'}>数据表</Radio>
          <Radio value={'dict'}>字典表</Radio>
        </Radio.Group>
      </div>
      <PopModelSelector
        modelSetting={{
          title: '选择数据源',
          width: 900,
          children: () => {
            return (
              <DictSelector {...businessPayload} />
            );
          }
        }}
      >
        {options ? takeTableInfo(options.tableInfo) : '点击绑定'}
      </PopModelSelector>
    </div>
  );
};
