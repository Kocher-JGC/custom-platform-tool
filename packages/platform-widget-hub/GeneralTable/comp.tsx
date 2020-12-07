import React from 'react';
import { ConfigProvider } from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import ProTable, { ProColumns, TableDropdown, ActionType } from '@ant-design/pro-table';
import './style.scss';
export interface GeneralTableCompProps {
  columns: any[]
  dataSource: any[]
  title: string
  titlePlace: 'left'|'right'|'center'
  pageSize: number
}

export const GeneralTableComp: React.FC<GeneralTableCompProps> = (props) => {
  // console.log(props);
  const { columns = [], dataSource = [], title, titlePlace, pageSize, ...other } = props || {};
  // console.log(columns, dataSource);
  return (
    <ConfigProvider locale={zhCN}>
      <ProTable 
        className={`title-place-${titlePlace}`}
        headerTitle={title}
        columns={columns || []} 
        dataSource={dataSource} 
        pagination={pageSize ? { pageSize }:false}
        {...other}
      />
    </ConfigProvider>
  );
};
