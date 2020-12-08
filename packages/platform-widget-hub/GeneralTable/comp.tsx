import React from 'react';
import { Table as AntTable } from 'antd';
import ProTable, { ProColumns, TableDropdown, ActionType } from '@ant-design/pro-table';
import { spawn } from 'child_process';
import './style.scss';
export interface GeneralTableCompProps {
  columns: any[]
  dataSource: any[]
  title: string
  titlePlace: 'left'|'right'|'center'
  pageSize: number
  showOrderColumn: boolean
}

export const GeneralTableComp: React.FC<GeneralTableCompProps> = (props) => {
  // console.log(props);
  const { columns = [], showOrderColumn, dataSource = [], title, titlePlace, pageSize, ...other } = props || {};
  // console.log(columns, dataSource);
  const getColumns = () => {
    if(!showOrderColumn) return columns;
    return [
      { dataIndex: 'order', key: 'key', title: '序号', search: false },
      ...columns
    ];
  };
  const columnsWithOrder = getColumns();
  return (
    <div>
      <ProTable 
        className={`title-place-${titlePlace}`}
        headerTitle={title}
        columns={columnsWithOrder || []} 
        dataSource={dataSource} 
        {...other}
        options={false}
      />
    </div>
  );
};
