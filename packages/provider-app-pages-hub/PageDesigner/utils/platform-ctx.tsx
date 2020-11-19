import React from 'react';
import { message } from 'antd';
import { CloseModal, ShowModal } from '@infra/ui';
import { PageMetadata, PlatformCtx } from '@platform-widget-access/spec';
import { DataSourceSelector } from '../components/PDDataSource';

interface CreatePlatformCtxOptions {
  changePageMeta
  genMetaRefID
  takeMeta
}

/**
 * 平台提供给的上下文
 */
export const createPlatformCtx = (ctx: CreatePlatformCtxOptions): PlatformCtx => {
  const { changePageMeta, genMetaRefID, takeMeta } = ctx;
  return {
    ui: {
      showMsg: (ctx) => {
        const { msg, type } = ctx;
        message[type](msg);
      }
    },
    meta: {
      changePageMeta,
      genMetaRefID,
      takeMeta,
    },
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
    },
  };
};

export const PlatformContext = React.createContext<PlatformCtx>();
