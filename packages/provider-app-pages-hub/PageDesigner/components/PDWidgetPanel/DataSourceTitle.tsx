import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PDUICtx } from '../../utils';

export const DataSourceTitle = ({
  onAddDataSource,
  interDatasources
}) => {
  return (
    <div className="flex items-center">
      <span>
        数据源
      </span>
      <PlusOutlined
        onClick={(e) => {
          const closeModal = PDUICtx.openDatasourceSelector({
            defaultSelected: interDatasources,
            modalType: 'side',
            type: 'TABLE',
            position: 'left',
            onSubmit: (submitData) => {
              onAddDataSource(submitData);
              closeModal();
            }
          });
        }}
      />
    </div>
  );
};
