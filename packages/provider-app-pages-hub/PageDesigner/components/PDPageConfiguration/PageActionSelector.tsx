import React from 'react';
import { Table, Select, Input } from 'antd';
import { PlusOutlined, MinusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { CloseModal, ShowModal } from "@infra/ui";
import pick from 'lodash/pick';

export class PageActionSelector extends React.Component {
  state = {
    dataSource: [{}]
  }

  componentDidMount(){
    this.setState({
      dataSource: this.initDataSource()
    });
  }
  initDataSource = () => {
    return [{ id: `${new Date().valueOf()}` }];
  }
  onGetAllEvents = () => {
    return this.state.dataSource;
  }
  getActionList = () => {
    return [
      { label: '打开链接', value: 'openLink', key: 'openLink' },
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
      openLink: {
        ModalContent: <></>,
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
    dataSource.splice(index+1, 0, { id: `${new Date().valueOf()}` });
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
  handleGetValue = (index, fields)=>{
    const dataSource = this.state.dataSource.slice();
    return pick(dataSource[index], fields);
  }

  getPerfectConfig = (action, actionConfig, ModalContent) => {
    return new Promise((resolve, reject) => {
      const modalID = ShowModal({
        title: '配置事件',
        width: 700,
        children: () => {
          return (
            <div className="p-2">
              <ModalContent
                onSuccess={(item) => {
                  CloseModal(modalID);
                  // proTableReload();
                  // goEdit(item);
                }}
              />
            </div>
          );
        }
      });
    });
  }

  handlePerfectActionConfig = (index, record, ModalContent) => {
    const {
      action,
      [action]: actionConfig
    } = record;
    this.getPerfectConfig(action, actionConfig, ModalContent).then((newActionConfig)=>{
      this.handleSetValue(index, {
        [action]: newActionConfig
      });
    });
  }
  render () {
    const { dataSource } = this.state;
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
              dataIndex: 'actionName',
              width: 139,
              title: '动作名称',
              align: 'center',
              render: (_t, _r, _i)=>{
                return (
                  <Input 
                    className="w-full"
                    onChange = {(value)=>{
                      this.handleSetValue(_i, {
                        actionName: value,
                      });
                    }}
                  />
                );
              }
            },
            {
              dataIndex: 'validMethods',
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
              dataIndex: 'action',
              width: 136,
              title: '动作',
              align: 'center',
              render: (_t, _r, _i)=>{
                return (
                  <Select 
                    className="w-full"
                    onChange={(value)=>{
                      this.handleSetValue(_i, {
                        action: value,
                        actionConfigCn: ''
                      });
                    }}
                    value={_r.action}
                    options={this.getActionList()}
                  />
                );
              }
            },
            {
              dataIndex: 'actionConfigCn',
              width: 140,
              title: '动作配置',
              align: 'center',
              render: (_t, _r, _i)=>{
                const { ModalContent, readOnly } = this.getActionConfig(_r.action);
                return (
                  <Input 
                    value={_r.actionConfigCn}
                    onClick={e=>{
                      ModalContent && this.handlePerfectActionConfig(_i, _r, ModalContent);
                    }}
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
