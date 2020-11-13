import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Button } from '@infra/ui';

interface SelectedRowInfo {
  id: string
  name: string
}
interface DictSelectorProps extends PD.PropItemRendererBusinessPayload {
  /** 提交已选中的项 */
  onSubmit: (selectedRowInfo: SelectedRowInfo) => void
  defaultSelectedInfo?: SelectedRowInfo
}

const DictSubItems = ({
  dictID,
  getDictWithSubItems
}) => {
  const [itemList, setItemList] = useState([{
    name: '',
    description: '',
    id: 'none'
  }]);
  useEffect(() => {
    getDictWithSubItems({ id: dictID }).then((res) => {
      setItemList(res?.result?.items);
    });
  }, []);
  return (
    <Table
      columns={[
        {
          dataIndex: 'code',
          title: '显示值'
        },
        {
          dataIndex: 'name',
          title: '实际值'
        },
      ]}
      rowKey="id"
      // rowKey={(r) => {
      //   console.log('r', r);
      //   return r.id + r.code;
      // }}
      dataSource={itemList}
      pagination={false}
    />
  );
};

export const DictSelector: React.FC<DictSelectorProps> = ({
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
    $services.dict.getDictList()
      .then(({ result }) => {
        const { data } = result;
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
        expandable={{
          expandedRowRender: (record) => (
            <DictSubItems
              dictID={record[rowKey]}
              getDictWithSubItems={$services.dict.getDictWithSubItems}
            />
          ),
          expandedRowKeys: [selectedRowInfo[rowKey]],
        }}
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
