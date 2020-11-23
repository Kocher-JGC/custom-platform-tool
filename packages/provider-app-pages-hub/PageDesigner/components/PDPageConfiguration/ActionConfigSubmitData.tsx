import React from 'react';
import { Table, Select, Input, Form, Space, Button } from 'antd';
import { PlusOutlined, MinusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { CloseModal, ShowModal } from "@infra/ui";
import { getTableList as getTableListAPI } from '@provider-app/table-editor/apis';
import { nanoid } from 'nanoid';
import { FormInstance } from 'antd/lib/form';
import { ActionConfigSubmitDataChangeFields } from './ActionConfigSubmitDataChangeFields';

const OPERATE_TYPE_MENU = [
  { label: '新增', key: 'insert', value: 'insert' },
  { label: '修改', key: 'update', value: 'update' },
  { label: '删除', key: 'delete', value: 'delete' }
];

export class ActionConfigSubmitData extends React.Component {
  state = {
    list: [],
    listForShow: [],
    maxIndex: -1,
    tableList: []
  }
  listFormRef = React.createRef<FormInstance>();
  searchFormRef = React.createRef<FormInstance>();

  handleFinish = async () => {
    const valid = await this.validateList();
    if(!valid) return;
    
  }
  handleCancel = () => {
    
  }
  handleReset = () => {
    this.setState({
      list: [],
      listForShow: [],
      maxIndex: -1
    }, ()=> {
      this.listFormRef.current?.setFieldsValue({list: this.state.listForShow});
    });
  }
  constructActions = () => {
    const result = {};
    this.state.list.forEach((item,order)=>{
      result[item.id] = { ...item, order };
    });
    return result;
  }
  validateList = () => {
    return new Promise((resolve, reject)=> {
      try {
        this.listFormRef.current?.validateFields();
        resolve(true);
      }catch(e){
        resolve(false);
      }
    });
  }

  componentDidMount(){
    this.getTableList();
    const list = this.initList();
    this.setState({
      list,
      listForShow: list,
      maxIndex: list.length > 0 ? list[list.length-1].index : this.state.maxIndex
    });
    this.listFormRef.current?.setFieldsValue({list});
  }
  getTableList = () => {
    getTableListAPI().then(res=>{
      this.setState({
        tableList: (res?.result?.data || []).map(item=>{
          return {
            label: item.name,
            key: item.code, value: item.id
          };
        }) || []
      });
    });
  };

  initActions = () => {
    const { config } = this.props;
    // if(!actions || Object.keys(actions).length === 0){
    //   const id = this.getActionId(0);
    //   return {
    //     [id]: { id }
    //   };
    // }
    return config || {};
  }

  initList = () => {
    const actions  = this.initActions();
    const list = [];
    for(const key in actions){
      const { order, ...data } = actions[key];
      list.push({ order, data });
    }
    return list.sort((a,b)=>a.order<b.order).map(item=>item.data);
  }

  getActionId = (index) => {
    return `act.submitData.${index}.${nanoid(8)}`;
  }

  handlePlus = (index) => {
    const { listForShow, list, maxIndex } = this.state;
    const newItem = { id: this.getActionId(maxIndex+1), index: maxIndex+1 };
    const newListForShow = [newItem, ...listForShow];
    this.setState({
      listForShow: newListForShow,
      list: [newItem, ...list],
      maxIndex: maxIndex+1
    });
    this.listFormRef.current?.setFieldsValue({list: newListForShow});
  }

  handleMinus = (id) => {
    const list = this.state.list.slice();
    const indexInList = this.getIndexById(list, id);
    list.splice(indexInList, 1);
    const listForShow = this.state.listForShow.slice();
    const indexInListForShow = this.getIndexById(listForShow, id);
    listForShow.splice(indexInListForShow, 1);
    this.setState({
      list,
      listForShow
    });
    this.listFormRef.current?.setFieldsValue({list: listForShow});
  }

  handleMoveUp = (index) => {
    const list = this.state.list.slice();
    const prev = list.splice(index-1, 1);
    list.splice(index,0,prev[0]);
    this.setState({
      list 
    });
  }

  handleMoveDown = (index) => {
    this.handleMoveUp(index+1);
  }

  getIndexById = (list, id) => {
    let index = -1;
    list.forEach((item, loopIndex)=>{
      if(item.id === id){
        index = loopIndex;
      }
    });
    return index;
  }
  handleSetValue = (id, data) => {
    const list = this.state.list.slice();
    const listForShow = this.state.listForShow.slice();
    const index = this.getIndexById(list, id);
    Object.assign(list[index], data);
    this.setState({
      list,
      listForShow,
    });
    this.listFormRef.current?.setFieldsValue({list: listForShow});
  }

  handleSearch = () => {
    const searchArea = this.searchFormRef.current?.getFieldsValue();
    const listForShow = this.filterListAfterSearch(searchArea);
    this.setState({ 
      listForShow,
    });
    this.listFormRef.current?.setFieldsValue({list: listForShow});
  }
  handleClear = () => {
    this.searchFormRef.current?.resetFields();
    this.handleSearch();
  }
  filterListAfterSearch = ({ tableId, operateType }) => {
    const { list } = this.state;
    return list.filter(item=>{
      return (!tableId || item.tableId ===tableId) && (!operateType || item.operateType === operateType);
    });
  }
  handleClickChangeFields=(_r)=>{
    const modalID = ShowModal({
      title: '配置字段',
      width: 900,
      children: () => {
        return (
          <div className="p-5">
            <ActionConfigSubmitDataChangeFields
              {..._r}
              onSuccess={(changeFields, changeFieldsTitle) => {
                this.handleSetValue(_r.id, { changeFields, changeFieldsTitle });
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
  }
  render () {
    const { listForShow, tableList } = this.state;
    return (
      <div className="page-action-submit-data">
        <Form
          className="search-area mt-2 mb-2 flex"
          layout="inline"
          ref={this.searchFormRef}
        >
          <Form.Item
            className="w-1/4"
            name="operateType"
          >
            <Select 
              placeholder="请选择操作类型"
              className="w-full"
              options = {OPERATE_TYPE_MENU}
            />
          </Form.Item>
          
          <Form.Item
            className="w-1/4"
            name="tableId"
          >
            <Select  
              placeholder="请选择数据表"
              filterOption = {(value, option)=>{
                return option.label.toLowerCase().includes(value.toLowerCase());
              }}
              showSearch
              allowClear
              className="w-full"
              options = {tableList}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={this.handleSearch}
          >
            搜索
          </Button>
          <Button
            className="ml-2"
            onClick={this.handleClear}
          >
            清空
          </Button>
          <div className="flex"></div>
          <Button
            type="primary"
            onClick={this.handlePlus}
          >
            新增
          </Button>
        </Form>
        <Form
          ref={this.listFormRef}
          onFinish={this.handleFinish}
        >
          <Table
            size="small"
            rowKey="id"
            dataSource = {listForShow}
            pagination={false}
            scroll={{ y: 440 }}
            columns={[
              {
                dataIndex: 'index',
                title: '序号',
                width:70,
                align: 'center',
                render: (_t, _r, index) => index+1
              },
              {
                dataIndex: 'operateType',
                key: 'operateType',
                title: '操作类型',
                align: 'center',
                width: 105,
                render: (_t, _r, _i)=>{
                  return (
                    <Form.Item
                      name={['list', _i, 'operateType']}
                      rules={[
                        { required: true, message: '操作类型必填' }
                      ]}
                    >
                      <Select  
                        className="w-full"
                        options = {OPERATE_TYPE_MENU}
                        onChange={(value)=>{
                          this.handleSetValue(_r.id, { operateType: value });
                        }}
                        value = {_r.operateType}
                      />
                    </Form.Item>
                  );
                }
              },
              {
                dataIndex: 'tableId',
                key: 'tableId',
                title: '目标数据表',
                align: 'center',
                width: 177,
                render: (_t, _r, _i)=>{
                  return (
                    <Form.Item
                      name={['list', _i, 'tableId']}
                      rules={[
                        { required: true, message: '数据表必填' }
                      ]}
                    >
                      <Select  
                        filterOption = {(value, option)=>{
                          return option?.label.toLowerCase().includes(value.toLowerCase());
                        }}
                        className="w-full"
                        options = {tableList}
                        onChange={(value, option)=>{
                          this.handleSetValue(_r.id, { tableId: value, tableCode: option.key, changeFields: null, changeRange: null });
                        }}
                        value = {_r.tableId}
                      />
                    </Form.Item>
                  );
                }
              },
              {
                dataIndex: 'changeFieldsTitle',
                key: 'changeFieldsTitle',
                title: '字段配置',
                align: 'center',
                width: 202,
                render: (_t, _r, _i)=>{
                  return _r.tableId && ['update', 'insert'].includes(_r.operateType) ? (
                    <Form.Item
                      name={['list', _i, 'changeFieldsTitle']}
                      rules={[{
                        validator: ()=>{

                        }
                      }]}
                    >
                      <Input
                        className="cursor-pointer"
                        title={_r.changeFieldsTitle}
                        onClick={()=>{this.handleClickChangeFields(_r);}}
                      />
                    </Form.Item>
                  ) : null;
                }
              },
              {
                dataIndex: 'changeRange',
                key: 'changeRange',
                title: '检索范围',
                width: 202,
                align: 'center',
                render: (_t, _r, _i)=>{
                  return _r.tableId && ['update', 'delete'].includes(_r.operateType) ? (
                    <Form.Item
                      name={['list', _i, 'changeRange']}
                      rules={[{
                        validator: ()=>{

                        }
                      }]}
                    >
                      <Input
                        className="cursor-pointer"
                      />
                    </Form.Item>
                  ) : null;
                }
              },
              {
                dataIndex: 'actionArea',
                width: 80,
                title: '操作',
                align: 'center',
                render: (_t, _r, _i)=>{
                  return (
                    <>
                      {/* <PlusOutlined 
                        onClick = {() => {this.handlePlus(_i);}}
                        className="mr-2 cursor-pointer"
                      /> */}
                      <MinusOutlined 
                        onClick = {()=>{this.handleMinus(_r.id);}}
                        className="mr-2 cursor-pointer"
                      />
                      {/* <Button
                        type="link"
                        onClick = {()=>{this.handleMinus(_r.id);}}
                      >删除</Button> */}
                      { _i !== 0 ? (<ArrowUpOutlined 
                        onClick = { () => {this.handleMoveUp(_i);}}
                        className="mr-2 cursor-pointer"
                      />) : null }
                      { _i !== listForShow.length - 1 ? ( <ArrowDownOutlined 
                        onClick = {() => {this.handleMoveDown(_i);}}
                        className="mr-2 cursor-pointer"
                      />) : null }
                    </>
                  );
                }
              }
            ]}
          />
          <Form.Item style={{ marginBottom: 0, marginTop: '0.5rem' }}>
            <Space className="float-right">
              <Button htmlType="button" onClick={this.handleReset}>
            清空
              </Button>
              <Button type="primary" htmlType="submit">
            确定
              </Button>
              <Button htmlType="button" onClick={this.handleCancel}>
            取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
        {/* <div className="clear-both mt-2" style={{ height: '30px' }}>
          <Button
            className="float-right"
            size="sm"
            onClick={this.handleCancel}
          >
          取消
          </Button>
          <Button
            className="float-right mr-2"
            onClick={this.handleOk}
            size="sm"
            type="primary"
          >
          确定
          </Button>
        </div> */}
      </div>      
    );
  }
}
