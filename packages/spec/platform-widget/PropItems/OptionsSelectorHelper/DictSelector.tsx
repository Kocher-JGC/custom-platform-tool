import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

type DictSelectorProps = PD.PropItemRendererBusinessPayload

export const DictSelector: React.FC<DictSelectorProps> = ({
  $services
}) => {
  // console.log('$services :>> ', $services);
  const [dictList, setDictList] = useState([]);
  useEffect(() => {
    $services.getDictionaryListServices()
      .then(({ result }) => {
        const { data } = result;
        setDictList(data);
      });
  }, []);
  return (
    <div>
      <Table
        columns={[
          {
            dataIndex: 'name',
            title: '标题'
          },
          {
            dataIndex: 'items',
            title: '子项',
            render: () => {

            }
          },
        ]}
        rowKey="id"
        size="small"
        dataSource={dictList}
      />
    </div>
  );
};
