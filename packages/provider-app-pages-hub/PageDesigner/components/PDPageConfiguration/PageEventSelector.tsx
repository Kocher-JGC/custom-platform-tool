import React from 'react';
import { Table, Select, Input } from 'antd';
import { PlusOutlined, MinusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export class PageEventSelector extends React.Component {
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
  getEventCodeList = () => {
    return [
      { label: '加载时', value: 'loading', key: 'loading' },
      { label: '刷新时', value: 'refresh', key: 'refresh' },
      { label: '销毁时', value: 'destroy', key: 'destroy' },
    ];
  };
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
  render () {
    const { dataSource } = this.state;
    return (
      <div className="page-event-selector">
        <Table
          columns={[
            {
              dataIndex: 'index',
              title: '序号',
              width:80,
              align: 'center',
              render: (_t, _r, index) => index+1
            },
            {
              dataIndex: 'eventCode',
              title: '事件',
              width:120,
              align: 'center',
              render: (_t, _r, _i)=>{
                return (
                  <Select 
                    className="w-full"
                    onChange={(value)=>{
                      this.handleSetValue(_i, {
                        eventCode: value
                      });
                    }}
                    value={_r.eventCode}
                    options={this.getEventCodeList()}
                  />
                );
              }
            },
            {
              dataIndex: 'validMethods',
              width: 250,
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
              width: 150,
              title: '动作',
              align: 'center',
              render: (_t, _r, _i)=>{
                return (
                  <Select 
                    className="w-full"
                    onChange={(value)=>{
                      this.handleSetValue(_i, {
                        action: value
                      });
                    }}
                    value={_r.action}
                    options={this.getActionList()}
                  />
                );
              }
            },
            {
              dataIndex: 'actionConfig',
              width: 250,
              title: '动作配置',
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
              dataIndex: 'condition',
              width: 250,
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
              width: 250,
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
                    { _i !== 0 ? (<ArrowUpOutlined 
                      onClick = { () => {this.handleMoveUp(_i);}}
                      className="mr-2 cursor-pointer"
                    />) : null }
                    { _i !== dataSource.length - 1 ? ( <ArrowDownOutlined 
                      onClick = {() => {this.handleMoveDown(_i);}}
                      className="mr-2 cursor-pointer"
                    />) : null }
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
