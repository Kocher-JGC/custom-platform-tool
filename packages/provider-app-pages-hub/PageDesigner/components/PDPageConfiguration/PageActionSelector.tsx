import React from 'react';
import { Table, Select, Input, Form, Modal, Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { CloseModal, ShowModal } from "@infra/ui";
import { nanoid } from 'nanoid';
import { ActionConfigOpenPage } from './ActionConfigOpenPage';
import { ActionConfigDisplayControl } from './ActionConfigDisplayControl';
import { ActionConfigSubmitData } from './ActionConfigSubmitData';
import { FormInstance } from 'antd/lib/form';

export class PageActionSelector extends React.Component {
  state = {
    list: [],
    listForShow: [],
    maxIndex: -1
  }
  listFormRef = React.createRef<FormInstance>();
  searchFormRef = React.createRef<FormInstance>();

  onSubmitData = async () => {
    const valid = await this.validateList();
    return {
      valid: valid ? 'valid': 'invalid',
      actions: this.constructActions()
    };
  }

  constructActions = () => {
    const result = {};
    this.state.list.forEach(item=>{
      const { index, ...action } = item;
      result[item.id] = action;
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

  canFilterList = () => {
    return new Promise((resolve, reject)=>{
      const hasEmptyOne = this.state.list.some(item=>{
        return this.isItemEmpty(item);
      });
      if(hasEmptyOne){
        Modal.confirm({
          title: '确认是否去除空行？',
          onOk: ()=>{
            resolve(true);
          },
          onCancel: ()=>{
            resolve(false);
          }  
        });
      }else {
        resolve(false);
      }
    });  
  }
  filterListWithoutEmptyOne = () => {
      
  }
  validateItem = (item) => {
    const validResult = {};
    const { name, actionType, [actionType]: actionConfig } = item;

    [{ key: 'name', value: name },{ key: actionType, value: actionType }].forEach(item=>{
      validResult[item.key] = !!item.value;
    });
    if(!['refreshPage', 'closePage'].includes(actionType) && !actionConfig){
      validResult.actionConfig = false;
    }
    return Object.values(validResult);
  }

  isItemEmpty = (item) => {
    return !Object.values(item).some(item=>!!item);
  }

  componentDidMount(){
    const list = this.initDataSource();
    this.setState({
      list,
      maxIndex: list.length > 0 ? list[list.length-1].index : this.state.maxIndex
    });
    this.listFormRef.current?.setFieldsValue({list});
  }

  initActions = () => {
    const { actions } = this.props.pageMetadata;
    // if(!actions || Object.keys(actions).length === 0){
    //   const id = this.getActionId(0);
    //   return {
    //     [id]: { id }
    //   };
    // }
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
      { label: '刷新控件（未实现）', value: 'refreshControl', key: 'refreshControl' },
      { label: '赋值给控件', value: 'setControlData', key: 'setControlData' },
      { label: '数据提交', value: 'submitData', key: 'submitData' },
      { label: '显示隐藏', value: 'displayControl', key: 'displayControl' },
      { label: '刷新页面', value: 'refreshPage', key: 'refreshPage' },
      { label: '关闭页面', value: 'closePage', key: 'closePage' },
      { label: '整表读取', value: 'readFormData', key: 'readFormData' },
      { label: '整表回写', value: 'writeFormData', key: 'writeFormData' },
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
      }, 
      displayControl: {
        width: 500,
        ModalContent: ActionConfigDisplayControl
      },
      submitData: {
        width: 900,
        ModalContent: ActionConfigSubmitData
      }
    };
    return action && config[action] || {};
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
    const { list, listForShow } = this.state;
    const index = this.getIndexById(list, id);
    Object.assign(list[index], data);
    this.setState({
      list: list.slice(),
      listForShow: listForShow.slice(),
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
                {...this.props}
              />
            </div>
          );
        }
      });
    });
  }

  handlePerfectActionConfig = (index, record, modalProps) => {
    const {
      actionType,
      [actionType]: actionConfig
    } = record;
    this.perfectConfigInModal(modalProps, actionConfig ).then(({ config, configCn })=>{
      this.handleSetValue(record.id, {
        [actionType]: config,
        configCn
      });
    });
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
  filterListAfterSearch = ({ type, name }) => {
    const { list } = this.state;
    return list.filter(item=>{
      return (!name || (item.name || '').includes(name)) && (!type || item.actionType === type);
    });
  }
  render () {
    const { listForShow } = this.state;
    return (
      <div className="page-action-selector">
        <Form
          className="search-area mt-2 mb-2 flex"
          layout="inline"
          ref={this.searchFormRef}
        >
          <Form.Item
            className="w-1/4"
            name="type"
          >
            <Select 
              placeholder="请选择动作类型"
              className="w-full"
              options={this.getTypeList()}
            />
          </Form.Item>
          
          <Form.Item
            className="w-1/4"
            name="name"
          >
            <Input
              placeholder="请输入动作名称"
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
        <Form ref={this.listFormRef}>
          <Table
            size="small"
            rowKey="id"
            dataSource = {listForShow}
            pagination={false}
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
                    <Form.Item
                      name={['list', _i, 'name']}
                      rules={[
                        { required: true, message: '动作名称必填' },
                        { 
                          validator: (_, value) => {
                            if(!value) return Promise.resolve();
                            const listTmpl = this.state.list;
                            const duplicate = listTmpl.some((item,index)=>item.name===value&&index!==_i);
                            if(duplicate){
                              return Promise.reject('动作名称重复');
                            }
                            return Promise.resolve();
                          } 
                        }
                      ]}
                    >
                      <Input 
                        className="w-full"
                        onChange = {(e)=>{
                          this.handleSetValue(_r.id, {
                            name: e.target.value,
                          });
                        }}
                        value={_r.name}
                      />
                    </Form.Item>
                  );
                }
              },
              {
                dataIndex: 'premise',
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
                dataIndex: 'actionType',
                width: 136,
                title: '动作',
                align: 'center',
                render: (_t, _r, _i)=>{
                  return (
                    <Form.Item
                      name={['list', _i, 'actionType']}
                      rules={[{
                        required: true, message: '动作必填'
                      }]}
                    >
                      <Select 
                        className="w-full"
                        onChange={(value)=>{
                          this.handleSetValue(_r.id, {
                            actionType: value,
                            configCn: ''
                          });
                        }}
                        value={_r.actionType}
                        options={this.getTypeList()}
                      />
                    </Form.Item>
                  );
                }
              },
              {
                dataIndex: 'configCn',
                width: 140,
                title: '动作配置',
                align: 'center',
                render: (_t, _r, _i)=>{
                  const { ModalContent, readOnly, width } = this.getActionConfig(_r.actionType);
                  return ModalContent ? (
                    <Form.Item
                      name={['list', _i, 'configCn']}
                      rules={[
                        { 
                          validator: (_, value) => {
                            if(!ModalContent)return Promise.resolve();
                            const { actionType } = _r;
                            if(!_r[actionType]) return Promise.reject('需补充动作配置');
                          } 
                        }
                      ]}
                    >
                      <Input 
                        value={_r.configCn}
                        onClick={e=>{
                          this.handlePerfectActionConfig(_i, _r, { ModalContent,width });
                        }}
                        title = {_r.configCn}
                        readOnly = {readOnly}
                        className = "w-full cursor-pointer"
                      />
                    </Form.Item>
                  ) : (
                    <Input 
                      value={_r.configCn}
                      title={_r.configCn}
                      readOnly = {readOnly}
                      className="w-full"
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
                      {/* <PlusOutlined 
                        onClick = {() => {this.handlePlus(_i);}}
                        className="mr-2 cursor-pointer"
                      /> */}
                      {/* <MinusOutlined 
                        onClick = {()=>{this.handleMinus(_i);}}
                        className="mr-2 cursor-pointer"
                      /> */}
                      <Button
                        type="link"
                        onClick = {()=>{this.handleMinus(_r.id);}}
                      >删除</Button>
                      {/* { _i !== 0 ? (<ArrowUpOutlined 
                      onClick = { () => {this.handleMoveUp(_i);}}
                      className="mr-2 cursor-pointer"
                    />) : null }
                    { _i !== list.length - 1 ? ( <ArrowDownOutlined 
                      onClick = {() => {this.handleMoveDown(_i);}}
                      className="mr-2 cursor-pointer"
                    />) : null } */}
                    </>
                  );
                }
              }
            ]}
          />
        </Form>
      </div>      
    );
  }
}
