import React, { forwardRef, useState } from 'react';
import { Table, Select, Input } from 'antd';
import { PlusOutlined, MinusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { CloseModal, ShowModal } from "@infra/ui";
import { nanoid } from 'nanoid';
import { ActionConfigOpenPage } from './ActionConfigOpenPage';


export class PageActionSelector extends React.Component {
  state = {
    dataSource: []
  }


  componentDidMount(){
    this.setState({
      dataSource: this.initDataSource()
    });
    const { onRef } = this.props;
    onRef && onRef(this);
  }

  initActions = () => {
    const { actions } = this.props.pageMetadata;
    if(!actions || Object.keys(actions).length === 0){
      const id = this.getActionId(0);
      return {
        [id]: { id }
      };
    }
    return actions;
  }
  initDataSource = () => {
    const actions  = this.initActions();
    const list = [];
    for(const key in actions){
      const index = this.getIndexByActionId(key);
      list.push({ index, data: actions[key] });
    }
    return list.sort((a,b)=>a.index<b.index).map(item=>item.data);
  }

  getIndexByActionId = (actionId) => {
    return (actionId || '').split('.')[1]-0;
  }

  getActionId = (index) => {
    return `action.${index}.${nanoid(8)}`;
  }

  getTypeList = () => {
    return [
      { label: '打开链接', value: 'openPage', key: 'openPage' },
      { label: '刷新控件', value: 'refreshControl', key: 'refreshControl' },
      { label: '赋值给控件', value: 'setControlData', key: 'setControlData' },
      { label: '库表操作', value: 'operateData', key: 'operateData' },
      { label: '显示隐藏', value: 'displayControl', key: 'displayControl' },
      { label: '刷新页面', value: 'refreshPage', key: 'refreshPage' },
      { label: '关闭页面', value: 'closePage', key: 'closePage' },
    ];
  };

  getActionConfig = (action) => {
    const config = {
      openPage: {
        ModalContent: ActionConfigOpenPage,
        width: 500
      },
      refreshPage: {
        readOnly: true
      },
      closePage: {
        readOnly: true
      }
    };
    return action && config[action] || {};
  }
  handlePlus = (index) => {
    const dataSource = this.state.dataSource.slice();
    dataSource.splice(index+1, 0, { id: this.getActionId(index+1) });
    console.log(dataSource);
    this.setState({
      dataSource 
    });
  }

  handleMinus = (index) => {
    const dataSource = this.state.dataSource.slice();
    dataSource.splice(index, 1);
    this.setState({
      dataSource 
    });
  }

  handleMoveUp = (index) => {
    const dataSource = this.state.dataSource.slice();
    const prev = dataSource.splice(index-1, 1);
    dataSource.splice(index,0,prev[0]);
    this.setState({
      dataSource 
    });
  }

  handleMoveDown = (index) => {
    this.handleMoveUp(index+1);
  }

  handleSetValue = (index, data) => {
    const dataSource = this.state.dataSource.slice();
    dataSource[index] = { ...dataSource[index], ...data };
    this.setState({
      dataSource
    });
  }

  perfectConfigInModal = ({ width, ModalContent }, actionConfig) => {
    return new Promise((resolve, reject) => {
      const modalID = ShowModal({
        title: '配置动作',
        width: width || 700,
        children: () => {
          return (
            <div className="p-5">
              <ModalContent
                config = {actionConfig}
                onSuccess={(config, configCn) => {
                  resolve({ config, configCn });
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
  }

  handlePerfectActionConfig = (index, record, config) => {
    const {
      action,
      [action]: actionConfig
    } = record;
    this.perfectConfigInModal(config, actionConfig ).then(({ config, configCn })=>{
      this.handleSetValue(index, {
        [action]: config,
        configCn
      });
    });
  }
  render () {
    const { dataSource } = this.state;
    console.log(this.props);
    return (
      <div className="page-event-selector">
        <Table
          columns={[
            {
              dataIndex: 'index',
              title: '序号',
              width:70,
              align: 'center',
              render: (_t, _r, index) => index+1
            },
            {
              dataIndex: 'name',
              width: 139,
              title: '动作名称',
              align: 'center',
              render: (_t, _r, _i)=>{
                return (
                  <Input 
                    className="w-full"
                    onChange = {(value)=>{
                      this.handleSetValue(_i, {
                        name: value,
                      });
                    }}
                  />
                );
              }
            },
            {
              dataIndex: 'preTrigger',
              width: 139,
              title: '动作前校验',
              align: 'center',
              render: (_t, _r)=>{
                return (
                  <Input 
                    className="w-full cursor-pointer"
                  />
                );
              }
            },
            {
              dataIndex: 'type',
              width: 136,
              title: '动作',
              align: 'center',
              render: (_t, _r, _i)=>{
                return (
                  <Select 
                    className="w-full"
                    onChange={(value)=>{
                      this.handleSetValue(_i, {
                        type: value,
                        configCn: ''
                      });
                    }}
                    value={_r.type}
                    options={this.getTypeList()}
                  />
                );
              }
            },
            {
              dataIndex: 'configCn',
              width: 140,
              title: '动作配置',
              align: 'center',
              render: (_t, _r, _i)=>{
                const { ModalContent, readOnly, width } = this.getActionConfig(_r.type);
                return (
                  <Input 
                    value={_r.configCn}
                    onClick={e=>{
                      ModalContent && this.handlePerfectActionConfig(_i, _r, { ModalContent,width });
                    }}
                    title={_r.configCn}
                    readOnly = {readOnly}
                    className={"w-full" + (ModalContent ? ' cursor-pointer' : '')}
                  />
                );
              }
            },
            {
              dataIndex: 'condition',
              width: 140,
              title: '条件',
              align: 'center',
              render: (_t, _r)=>{
                return (
                  <Input 
                    className="w-full cursor-pointer"
                  />
                );
              }
            },
            {
              dataIndex: 'actionArea',
              width: 73,
              title: '操作',
              align: 'center',
              render: (_t, _r, _i)=>{
                return (
                  <>
                    <PlusOutlined 
                      onClick = {() => {this.handlePlus(_i);}}
                      className="mr-2 cursor-pointer"
                    />
                    {dataSource.length > 1 ? (<MinusOutlined 
                      onClick = {this.handleMinus}
                      className="mr-2 cursor-pointer"
                    />) : null }
                    {/* { _i !== 0 ? (<ArrowUpOutlined 
                      onClick = { () => {this.handleMoveUp(_i);}}
                      className="mr-2 cursor-pointer"
                    />) : null }
                    { _i !== dataSource.length - 1 ? ( <ArrowDownOutlined 
                      onClick = {() => {this.handleMoveDown(_i);}}
                      className="mr-2 cursor-pointer"
                    />) : null } */}
                  </>
                );
              }
            },
          ]}
          size="small"
          dataSource={dataSource}
          rowKey="id"
          pagination={false}
        />
      </div>
    );
  }
}
