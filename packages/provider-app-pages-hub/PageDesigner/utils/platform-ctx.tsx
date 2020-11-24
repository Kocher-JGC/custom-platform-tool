import React from 'react';
import { message } from 'antd';
import { CloseModal, ShowModal } from '@infra/ui';
import { PlatformCtx } from '@platform-widget-access/spec';
import { DataSourceSelector } from '../components/PDDataSource';

/**
 * 平台提供给的上下文
 */
export const createPlatformCtx = (metaCtx: PlatformCtx['meta']): PlatformCtx => {
  return {
    ui: {
      showMsg: (ctx) => {
        const { msg, type } = ctx;
        message[type](msg);
      }
    },
    meta: metaCtx,
    selector: {
      openDatasourceSelector: (options) => {
        const { defaultSelected, modalType, position, type, single, onSubmit } = options;
        const ModalID = ShowModal({
          title: '数据源选择',
          type: modalType,
          position,
          children: ({ close }) => {
            return (
              <DataSourceSelector
                bindedDataSources={defaultSelected}
                type={type}
                single={single}
                onSubmit={(selectedDSFromRemote, interDatasources) => {
                  onSubmit({ close, interDatasources, selectedDSFromRemote });
                }}
              />
            );
          }
        });
        return () => {
          CloseModal(ModalID);
        };
      }
    },
  };
};

export const PlatformContext = React.createContext<PlatformCtx>();
