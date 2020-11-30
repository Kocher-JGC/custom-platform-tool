import React from 'react';
import { Table as AntTable } from 'antd';
import ProTable, { ProColumns, TableDropdown, ActionType } from '@ant-design/pro-table';

export interface GeneralTableCompProps {
  columns: any[]
  dataSource: any[]
}

export const GeneralTableComp: React.FC<GeneralTableCompProps> = (props) => {
  // console.log(props);
  const { columns = [], dataSource = [], ...other } = props || {};
  // console.log(columns, dataSource);
  return (
    <div>
      <ProTable columns={columns || []} dataSource={dataSource} {...other} />
    </div>
  );
};
