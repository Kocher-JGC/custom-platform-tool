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
}

export const GeneralTableComp: React.FC<GeneralTableCompProps> = (props) => {
  // console.log(props);
  const { columns = [], dataSource = [], title, titlePlace, ...other } = props || {};
  // console.log(columns, dataSource);
  return (
    <div>
      <ProTable 
        className={`title-place-${titlePlace}`}
        headerTitle={title}
        columns={columns || []} 
        dataSource={dataSource} 
        {...other}
      />
    </div>
  );
};
