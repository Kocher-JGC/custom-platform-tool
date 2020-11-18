import React from 'react';
import { message } from 'antd';
import { CloseModal, ShowModal } from '@infra/ui';
import { PlatformUICtx } from '@platform-widget-access/spec';
import { DataSourceSelector } from '../components/PDDataSource';


export const PDUICtx: PlatformUICtx = {
  utils: {
    showMsg: (ctx) => {
      const { msg, type } = ctx;
      message[type](msg);
    }
  },
  openDatasourceSelector: (options) => {
    const { defaultSelected, modalType, position, type, onSubmit } = options;
    const ModalID = ShowModal({
      title: '数据源选择',
      type: modalType,
      position,
      children: ({ close }) => {
        return (
          <DataSourceSelector
            bindedDataSources={defaultSelected}
            type={type}
            onSubmit={(selectedItems, interDatasources) => {
              onSubmit(selectedItems, { close, interDatasources });
            }}
          />
        );
      }
    });
    return () => {
      CloseModal(ModalID);
    };
  }
};
