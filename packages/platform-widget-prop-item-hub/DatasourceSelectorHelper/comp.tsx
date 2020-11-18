import React, { useState } from 'react';
import { Radio } from 'antd';
import { PropItemRenderContext } from '@engine/visual-editor/data-structure';
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
    changeMetadata,
    takeMeta,
    genMetaRefID,
    whichAttr,
    editingWidgetState,
    widgetEntity,
    businessPayload,
    UICtx,
  } = props;
  const { $services } = businessPayload;
  // 选项数据源的引用
  const DSOptionsRef = editingWidgetState[whichAttr] as string | undefined;
  const datasourceMeta = DSOptionsRef ? takeMeta({
    metaAttr: 'dataSource',
    metaRefID: DSOptionsRef
  }) as OptionsType : null;
  const [dsType, setDsType] = useState(datasourceMeta?.type);

  const dsBinder = dsType ? (
    <div 
      onClick={e => {
        UICtx.openDatasourceSelector({
          defaultSelected: datasourceMeta ? [datasourceMeta] : [],
          modalType: 'side',
          position: 'right',
          single: true,
          type: dsType,
          onSubmit: (submitData, { close, interDatasources }) => {
            const nextMetaID = genMetaRefID('dataSource');
            changeEntityState({
              attr: whichAttr,
              value: nextMetaID
            });
            changeMetadata({
              metaAttr: 'dataSource',
              metaID: nextMetaID,
              rmMetaID: DSOptionsRef,
              // 由于是单选的，所以只需要取 0
              data: interDatasources[0]
              // metaID:
            });
            // console.log(submitData);

            close();
          }
        });
      }}
    >
      {datasourceMeta ? takeTableInfo(datasourceMeta) : '点击绑定'}
    </div>
    // <PopModelSelector
    //   modelSetting={{
    //     title: '选择数据源',
    //     type: 'side',
    //     position: 'right',
    //     width: 400,
    //     children: ({ close }) => {
    //       const defaultSelectedInfo = datasourceMeta ? {
    //         id: datasourceMeta?.tableInfo.id,
    //         name: datasourceMeta?.tableInfo.name,
    //       } : undefined;
    //       switch (dsType) {
    //         case 'dict':
    //           return (
    //             <DictSelector
    //               {...businessPayload}
    //               defaultSelectedInfo={defaultSelectedInfo}
    //               onSubmit={(selectedRowInfo) => {
    //                 const { id, name } = selectedRowInfo;
    //                 const nextState: OptionsType = {
    //                   type: dsType,
    //                   tableInfo: {
    //                     id,
    //                     name,
    //                     condition: null,
    //                     defaultVal: null,
    //                     sort: 'desc'
    //                   }
    //                 };
    //                 const nextMetaID = genMetaRefID(`ds`);
    //                 changeEntityState({
    //                   attr: whichAttr,
    //                   value: nextMetaID
    //                 });
    //                 changeMetadata({
    //                   metaAttr: 'dataSource',
    //                   metaID: nextMetaID,
    //                   rmMetaID: DSOptionsRef,
    //                   data: nextState
    //                   // metaID:
    //                 });
    //                 close();
    //               }}
    //             />
    //           );
    //         case 'table':
    //           return (
    //             <TableSelector
    //               {...businessPayload}
    //               defaultSelectedInfo={defaultSelectedInfo}
    //               onSubmit={(selectedRowInfo) => {
    //                 const { id, name } = selectedRowInfo;
    //                 const nextState: OptionsType = {
    //                   type: dsType,
    //                   tableInfo: {
    //                     id,
    //                     name,
    //                     condition: null,
    //                     defaultVal: null,
    //                     sort: 'desc'
    //                   }
    //                 };
    //                 const nextMetaID = genMetaRefID(`ds`);
    //                 changeEntityState({
    //                   attr: whichAttr,
    //                   value: nextMetaID
    //                 });
    //                 changeMetadata({
    //                   metaAttr: 'dataSource',
    //                   metaID: nextMetaID,
    //                   rmMetaID: DSOptionsRef,
    //                   data: nextState
    //                   // metaID:
    //                 });
    //                 close();
    //               }}
    //             />
    //           );
    //       }
    //     }
    //   }}
    // >
    //   {datasourceMeta ? takeTableInfo(datasourceMeta.tableInfo) : '点击绑定'}
    // </PopModelSelector>
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
