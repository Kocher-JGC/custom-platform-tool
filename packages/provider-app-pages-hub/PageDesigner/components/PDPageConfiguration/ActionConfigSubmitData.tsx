import React, { useState, useEffect } from 'react';
import { Table, Select, Input } from 'antd';
import { PlusOutlined, MinusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { CloseModal, ShowModal } from "@infra/ui";
import { getTableList as getTableListAPI } from '@provider-app/table-editor/apis';

const OPERATE_TYPE_MENU = [
  { label: '新增', key: 'insert', value: 'insert' },
  { label: '修改', key: 'update', value: 'update' },
  { label: '删除', key: 'delete', value: 'delete' }
];
export const ActionConfigSubmitData = ({
  config, onSuccess, onCancel
}) => {
  const [list, setList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const columns = [
    {
      dataIndex: 'index',
      key: 'index',
      title: '序号',
      width: 62,
      render: (_t, _r, _i)=> _i+1
    },{
      dataIndex: 'operateType',
      key: 'operateType',
      title: '操作类型',
      align: 'center',
      width: 115,
      render: (_t, _r, _i)=> {
        return (
          <Select  
            className="w-full"
            options = {OPERATE_TYPE_MENU}
            onChange={(value)=>{
              handleSetValue(_i, { operateType: value });
            }}
            value = {_r.operateType}
          />
        );
      }
    },{
      dataIndex: 'tableId',
      key: 'tableId',
      title: '目标数据表',
      align: 'center',
      width: 177,
      render: (_t, _r, _i)=> {
        return (
          <Select  
            filterOption = {(value, option)=>{
              return option.label.toLowerCase().includes(value.toLowerCase());
            }}
            className="w-full"
            options = {tableList}
            onChange={(value)=>{}}
            value = {_r.tableId}
          />
        );
      }
    },{
      dataIndex: 'changeColumns',
      key: 'changeColumns',
      title: '字段配置',
      align: 'center',
      width: 202,
      render: (_t, _r, _i)=> {
        return (
          <Select  
            className="w-full"
            options = {[]}
            onChange={(value)=>{}}
            value = {_r.tableId}
          />
        );
      }
    },{
      dataIndex: 'changeRange',
      key: 'changeRange',
      title: '条件配置',
      width: 202,
      align: 'center',
      render: (_t, _r, _i)=> {
        return (
          <Select  
            className="w-full"
            options = {[]}
            onChange={(value)=>{}}
            value = {_r.tableId}
          />
        );
      }
    },
    {
      dataIndex: 'actionArea',
      width: 107,
      title: '操作',
      align: 'center',
      render: (_t, _r, _i)=>{
        return (
          <>
            <PlusOutlined 
              onClick = {() => {handlePlus(_i);}}
              className="mr-2 cursor-pointer"
            />
            {list.length > 1 ? (<MinusOutlined 
              onClick = {()=>{handleMinus(_i);}}
              className="mr-2 cursor-pointer"
            />) : null }
            { _i !== 0 ? (<ArrowUpOutlined 
              onClick = { () => {handleMoveUp(_i);}}
              className="mr-2 cursor-pointer"
            />) : null }
            { _i !== list.length - 1 ? ( <ArrowDownOutlined 
              onClick = {() => {handleMoveDown(_i);}}
              className="mr-2 cursor-pointer"
            />) : null }
          </>
        );
      }
    },
  ];
  useEffect(() => {
    getTableList();
  }, []);

  const getTableList = () => {
    getTableListAPI().then(res=>{
      setTableList((res?.result?.data || []).map(item=>{
        return {
          label: item.name,
          key: item.id, value: item.id
        };
      }));
    });
  };
  
  const handleSetValue = (index, data) => {
    const listTmpl = list.slice();
    listTmpl[index] = { ...listTmpl[index], ...data };
    setList(listTmpl);
  };

  const handlePlus = (index) => {
    const listTmpl = list.slice();
    listTmpl.splice(index+1, 0, {});
    setList(listTmpl);
  };

  const handleMinus = (index) => {
    const listTmpl = list.slice();
    listTmpl.splice(index, 1);
    setList(listTmpl);
  };

  const handleMoveUp = (index) => {
    const listTmpl = list.slice();
    const prev = listTmpl.splice(index-1, 1);
    listTmpl.splice(index,0,prev[0]);
    setList(listTmpl);
  };

  const handleMoveDown = (index) => {
    handleMoveUp(index+1);
  };
  useEffect(() => {
    setList(config?.length > 0 ? config : [{}]);
  }, []);
  return (
    <>
      <Table
        size="small"
        dataSource = {list}
        columns = {columns}
        pagination={false}
      />
    </>
  );
};