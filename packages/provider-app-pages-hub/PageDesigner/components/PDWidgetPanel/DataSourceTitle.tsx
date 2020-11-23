import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PlatformCtx } from '../../platform-access';
import { PlatformContext } from '../../utils';

interface DataSourceTitleProps {
  interDatasources
  onAddDataSource
  platformCtx: PlatformCtx
}

export const DataSourceTitle: React.FC<DataSourceTitleProps> = ({
  onAddDataSource,
  platformCtx,
  interDatasources
}) => {
  return (
    <PlatformContext.Consumer>
      {
        (platformCtx) => {
          return (
            <div className="flex items-center">
              <span>
                数据源
              </span>
              <PlusOutlined
                onClick={(e) => {
                  const closeModal = platformCtx.selector.openDatasourceSelector({
                    defaultSelected: interDatasources,
                    modalType: 'side',
                    type: 'TABLE',
                    position: 'left',
                    onSubmit: ({ interDatasources }) => {
                      onAddDataSource(interDatasources);
                      closeModal();
                    }
                  });
                }}
              />
            </div>
          );
        }
      }
    </PlatformContext.Consumer>
  );
};
