import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Button } from '@infra/ui';

interface SelectedRowInfo {
  id: string
  name: string
}
interface TableSelectorProps extends PD.PropItemRendererBusinessPayload {
  /** 提交已选中的项 */
  onSubmit: (selectedRowInfo: SelectedRowInfo) => void
  defaultSelectedInfo?: SelectedRowInfo
}

export const TableSelector: React.FC<TableSelectorProps> = ({
  $services,
  defaultSelectedInfo = {
    id: '',
    name: ''
  },
  onSubmit
}) => {
  const rowKey = 'id';
  // console.log('$services :>> ', $services);
  const [dictList, setDictList] = useState([]);
  useEffect(() => {
    $services.table.getTable()
      .then(({ result }) => {
        const { data } = result;
        console.log('result :>> ', result);
        setDictList(data);
      });
  }, []);
  const [selectedRowInfo, onSelectChange] = useState<SelectedRowInfo>(defaultSelectedInfo);
  return (
    <div className="p-4">
      <Table
        columns={[
          {
            dataIndex: 'name',
            title: '标题'
          },
          {
            dataIndex: 'description',
            title: '描述',
          },
        ]}
        rowSelection={{
          selectedRowKeys: [selectedRowInfo[rowKey]],
          type: 'radio',
          onChange: (rowKeys, rows) => {
            // 由于是单选的，所以只需要提取其中必要的信息
            const selectedRow = rows[0];
            const { id, name } = selectedRow;
            onSelectChange({
              id,
              name
            });
          },
        }}
        rowKey="id"
        size="small"
        dataSource={dictList}
      />
      <Button
        disabled={!selectedRowInfo[rowKey]}
        onClick={(e) => {
          /** 由于是单选的，所以只需要返回字符串即可 */
          onSubmit(selectedRowInfo);
        }}
      >
        确定选择
      </Button>
    </div>
  );
};
