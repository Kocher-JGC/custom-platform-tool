import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { getPageListServices } from '@provider-app/page-manager/services/apis';

export const PageSelectorLite = ({
  defaultSelectItem,
  onSelect
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([defaultSelectItem]);
  const rowSelection = {
    selectedRowKeys,
    type: 'radio',
    onChange: (keys) => {
      onSelect(keys);
      setSelectedRowKeys(keys);
    },
  };

  const [pageList, setPageList] = useState([]);

  useEffect(() => {
    // TODO: 从 $services 中获取
    getPageListServices({
      offset: 0,
      size: 10,
      totalSize: true,
    }).then((pageListRes) => {
      setPageList(pageListRes.result?.data);
    });
  }, []);

  return (
    <div className="flex flex-1">
      <Table
        columns={[
          {
            title: '页面名称',
            dataIndex: 'name',
            width: 200,
            ellipsis: true
          }
        ]}
        size="small"
        rowKey="id"
        rowSelection={rowSelection}
        dataSource={pageList}
      />
    </div>
  );
};
