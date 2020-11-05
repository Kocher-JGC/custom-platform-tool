import React, { useState } from 'react';
import { Radio } from 'antd';
import { PropItemRenderContext } from '@engine/visual-editor/data-structure';
import { PopModelSelector } from '@infra/ui';
import { DictSelector } from './DictSelector';

interface OptionsType {
  type: 'table' | 'dict'
  tableInfo: {
    id: string
    name: string
    condition
    defaultVal
    sort
  }
}

const takeTableInfo = (_tableInfo: OptionsType['tableInfo']) => {
  return _tableInfo.name;
};

interface OptionsSelectorProps extends PropItemRenderContext {
  whichAttr: string
}

export const OptionsSelector: React.FC<OptionsSelectorProps> = (props) => {
  const {
    changeEntityState,
    changeMetadata,
    takeMeta,
    genMetaRefID,
    whichAttr,
    editingWidgetState,
    widgetEntity,
    businessPayload,
  } = props;
  const { interDatasources, $services } = businessPayload;
  // 选项数据源的引用
  const DSOptionsRef = editingWidgetState[whichAttr] as string | undefined;
  const datasourceMeta = DSOptionsRef ? takeMeta({
    metaAttr: 'dataSource',
    metaRefID: DSOptionsRef
  }) as OptionsType : null;
  const [dsType, setDsType] = useState(datasourceMeta?.type || 'dict');
  return (
    <div>
      <div className="py-2">
        <Radio.Group
          onChange={(e) => {
            setDsType(e.target.value);
          }}
          value={dsType}
        >
          <Radio value={'table'}>数据表</Radio>
          <Radio value={'dict'}>字典表</Radio>
        </Radio.Group>
      </div>
      <PopModelSelector
        modelSetting={{
          title: '选择数据源',
          width: 900,
          children: ({ close }) => {
            const defaultSelectedInfo = DSOptionsRef ? {
              id: DSOptionsRef?.tableInfo.id,
              name: DSOptionsRef?.tableInfo.name,
            } : undefined;
            return (
              <DictSelector
                {...businessPayload}
                defaultSelectedInfo={defaultSelectedInfo}
                onSubmit={(selectedRowInfo) => {
                  const { id, name } = selectedRowInfo;
                  const nextState: OptionsType = {
                    type: dsType,
                    tableInfo: {
                      id,
                      name,
                      condition: null,
                      defaultVal: null,
                      sort: 'desc'
                    }
                  };
                  const nextMetaID = genMetaRefID(`ds`);
                  changeEntityState({
                    attr: whichAttr,
                    value: nextMetaID
                  });
                  changeMetadata({
                    metaAttr: 'dataSource',
                    metaID: nextMetaID,
                    rmMetaID: DSOptionsRef,
                    data: nextState
                    // metaID:
                  });
                  close();
                }}
              />
            );
          }
        }}
      >
        {datasourceMeta ? takeTableInfo(datasourceMeta.tableInfo) : '点击绑定'}
      </PopModelSelector>
    </div>
  );
};
