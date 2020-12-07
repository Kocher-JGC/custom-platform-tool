import React, { useState } from 'react';
import { Radio } from 'antd';
import { PropItemRenderContext } from '@platform-widget-access/spec';
// import { PopModelSelector } from '@infra/ui';
// import { DictSelector } from './DictSelector';
// import { TableSelector } from './TableSelector';

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

  const dsBinder = (
    <div 
      className="px-4 py-2 border cursor-pointer"
      onClick={e => {
        platformCtx.selector.openDatasourceSelector({
          defaultSelected: datasourceMeta ? [datasourceMeta] : [],
          modalType: 'normal',
          position: 'top',
          single: true,
          typeSingle: true,
          typeArea: ['TABLE', 'DICT'],
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
  );

  return (
    <div>
      {
        dsBinder
      }
    </div>
  );
};
