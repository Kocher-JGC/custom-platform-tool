import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import lowerFirst from 'lodash/lowerFirst';
import { ShowModal, CloseModal } from '@infra/ui';
import { VariableEditor } from './PageVariableEditor';
import { nanoid } from 'nanoid';
export enum VarAttrTypeMap {
  string = '字符串',
  number = '数字'
}

export const PageVariableSelector = ({
  getVariableData,
  changePageMeta
}) => {
  const [variableList, setVariableList] = useState([]);
  const sortList = (list)=>{
    return list.sort((a, b)=>{
      return getOrder(b)-getOrder(a);
    });
  };
  const getVariableList = (variableData) => {
    return [
      { code: '页面变量', id:'page', children: variableData.page },
      { code: '控件变量', id: 'widget', children: variableData.widget },
      { code: '输入参数变量', id: 'pageInput', children: sortList(variableData.pageInput) }
    ];
  };
  useEffect(()=>{
    initVariableList();
  },[]);
  const initVariableList = () => {
    getVariableData().then(res=>{
      setVariableList(getVariableList(res));
    });
  };
  const actionRenderer = (record) => {
    if(['pageInput'].includes(record.type)){
      return (
        <>
          <Button type="link" size="small" onClick={()=>{handleEdit(record, 'UPDATE');}}>编辑</Button>
          <Button type="link" size="small" onClick={()=>{handleDelete(record);}}>删除</Button>
        </>
      );
    }
    if(['pageInput'].includes(record.id)){
      return <Button type="link" size="small" onClick={()=>{handlePlus(record, 'INSERT');}}>新增</Button>;
    }
  };
  const openModal = (mode:string, record?:any)=>{
    return new Promise((resolve, reject)=>{
      const modalID = ShowModal({
        title: '配置变量',
        width: 900,
        children: () => {
          return (
            <div className="p-5">
              <VariableEditor
                mode={mode}
                data={record}
                onSuccess={(data) => {
                  resolve(data);
                  CloseModal(modalID);
                }}
                onCancel={()=>{
                  CloseModal(modalID);
                }}
              />
            </div>
          );
        }
      });
    });
  };
  const getOrder = (item)=>{
    return item.id.split('.')[2]-0;
  };
  const newOrder = record => {
    if('children' in record && Array.isArray(record.children) && record.children.length > 0){
      return getOrder(record.children[0])+1;
    }
    return 0;
  };
  const handlePlus = (record, mode) => {
    const { id: type } = record;
    openModal(mode).then(data=>{
      const metaID = `var.${type}.${newOrder(record)}.${nanoid(8)}`;
      changePageMeta({
        metaAttr: 'varRely',
        data: { type, ...data },
        metaID
      });
      initVariableList();
    });
  };
  const handleEdit = (record, mode) => {
    const { id, ...oldData } = record;
    openModal(mode, record).then(data=>{
      changePageMeta({
        metaAttr: 'varRely',
        data: { ...oldData, ...data },
        metaID: id
      });
      initVariableList();
    });
  };
  const handleDelete = (record) => {
    changePageMeta({
      metaAttr: 'varRely',
      rmMetaID: record.id
    });
    initVariableList();
  };
  return (
    <div className="page-var-selector">
      <Table
        columns={[
          {
            dataIndex: 'code',
            title: '变量编码',
            width: 300,
            render: (_t)=>lowerFirst(_t)
          },
          {
            dataIndex: 'varType',
            title: '类型',
            width: 100,
            align: 'center',
            render: (_t)=>VarAttrTypeMap[_t]
          },
          {
            dataIndex: 'alias',
            title: '描述',
            width: 400,
            align: 'center',
          },
          {
            dataIndex: 'action',
            title: '操作',
            width: 120,
            render: (_, record) => {
              return actionRenderer(record);
            }
          },
        ]}
        pagination={false}
        size="small"
        dataSource={variableList}
        rowKey="id"
      />
    </div>
  );
};
