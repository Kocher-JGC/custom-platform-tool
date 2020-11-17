import React from 'react';
import { CloseModal, ShowModal } from '@infra/ui';
import { PlusOutlined } from '@ant-design/icons';
import { DataSourceSelector } from "../PDDataSource";

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
          const modalID = ShowModal({
            title: '添加数据源',
            type: 'side',
            position: 'left',
            width: 400,
            children: () => {
              return (
                <DataSourceSelector
                  bindedDataSources={interDatasources}
                  onSubmit={(submitData) => {
                    console.log(submitData);
                    onAddDataSource(submitData);
                    CloseModal(modalID);
                  }}
                />
              );
            }
          });
        }}
      />
    </div>
  );
};
