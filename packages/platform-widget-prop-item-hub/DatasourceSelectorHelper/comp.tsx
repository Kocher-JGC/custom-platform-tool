import React, { useState } from 'react';
import { Radio } from 'antd';
import { PropItemRenderContext } from '@platform-widget-access/spec';

interface OptionsType {
  type: 'TABLE' | 'DICT'
  tableInfo: {
    id: string
    name: string
    condition
    defaultVal
    sort
  }
}

const takeTableInfo = (_tableInfo) => {
  return _tableInfo.name;
};

interface OptionsSelectorProps extends PropItemRenderContext {
  whichAttr: string
}

export const OptionsSelector: React.FC<OptionsSelectorProps> = (props) => {
  const {
    changeEntityState,
    whichAttr,
    editingWidgetState,
    platformCtx,
  } = props;

  const {
    changePageMeta,
    takeMeta,
    genMetaRefID,
  } = platformCtx.meta;
  // 选项数据源的引用
  const DSOptionsRef = editingWidgetState[whichAttr] as string | undefined;
  const datasourceMeta = DSOptionsRef ? takeMeta({
    metaAttr: 'dataSource',
    metaRefID: DSOptionsRef
  }) as OptionsType : null;
  const [dsType, setDsType] = useState(datasourceMeta?.type);

  const dsBinder = dsType ? (
    <div 
      className="px-4 py-2 border cursor-pointer"
      onClick={e => {
        platformCtx.selector.openDatasourceSelector({
          defaultSelected: datasourceMeta ? [datasourceMeta] : [],
          modalType: 'side',
          position: 'right',
          single: true,
          type: dsType,
          onSubmit: ({ close, interDatasources }) => {
            // 由于是单选的，所以只需要取 0
            const bindedDS = interDatasources[0];
            const nextMetaID = changePageMeta({
              type: 'create/rm',
              metaAttr: 'dataSource',
              metaID: DSOptionsRef,
              rmMetaID: DSOptionsRef,
              data: bindedDS
              // metaID:
            });
            changeEntityState({
              attr: whichAttr,
              value: nextMetaID
            });
            // console.log(submitData);

            close();
          }
        });
      }}
    >
      {datasourceMeta ? takeTableInfo(datasourceMeta) : '点击绑定'}
    </div>
  ) : null;

  return (
    <div>
      <div className="py-2">
        <Radio.Group
          onChange={(e) => {
            setDsType(e.target.value);
          }}
          value={dsType}
        >
          <Radio value={'TABLE'}>数据表</Radio>
          <Radio value={'DICT'}>字典表</Radio>
        </Radio.Group>
      </div>
      {
        dsBinder
      }
    </div>
  );
};
