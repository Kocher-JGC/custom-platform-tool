import React from 'react';
import { Table as AntTable } from 'antd';
import ProTable, { ProColumns, TableDropdown, ActionType } from '@ant-design/pro-table';

export interface GeneralTableCompProps {
  columns: any[]
  dataSource: any[]
  title: string
  titlePlace: string
}

export const GeneralTableComp: React.FC<GeneralTableCompProps> = (props) => {
  // console.log(props);
  const { columns = [], dataSource = [], title, ...other } = props || {};
  // console.log(columns, dataSource);
  return (
    <div>
      <ProTable 
        headerTitle={title}
        columns={columns || []} 
        dataSource={dataSource} 
        {...other}
      />
    </div>
  );
};
