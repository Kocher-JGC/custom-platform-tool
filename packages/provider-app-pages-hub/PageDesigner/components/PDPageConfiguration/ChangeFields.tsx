import React from 'react';
import { Table, Button, Space } from 'antd';
import { ValueHelper } from '@provider-app/page-designer/components/PDInfraUI';
export class ChangeFields extends React.PureComponent {
  state = {
    treeList: [],
    treeMap: {},
    changeFields: {},
    variableData: {}
  }
  componentDidMount(){
    this.getColumnList();
    this.setState({
      changeFields: this.props.changeFields || {}
    });
    this.props.platformCtx.meta.getVariableData([]).then(variableData=>{
      this.setState({ variableData });
    });
  }
  getColumnList = () => {
    return new Promise((resolve, reject)=>{
      $R_P.post({
        url: '/data/v1/tables/tableWithAux',
        data: { tables: [{
          tableId: this.props.tableId,
          addWithAuxTable: true
        }] }
      }).then((res)=>{
        const treeList = this.constructTableList(res?.result||[]);
        this.setState({
          treeList,
          treeMap: this.constructTreeMap(treeList)
        }, () => {
          resolve();
        });
      });
    });    
  }
  constructTreeMap = (list) => {
    const map = {};
    list.forEach(table=>{
      const { id: tableId, children } = table;
      map[tableId] = table;
      children.forEach(column=>{
        const { columnId } = column;
        map[tableId+'.'+columnId] = column;
      });
    });
    return map;
  }

  constructTableList = (tables) => {
    const list = tables.map(item => {
      const { name: tableName, id: tableId, code: tableCode } = item;
      return {
        tableCode, tableName, tableId, name: tableName, id: tableId,
        children: this.constructColumnList(item.columns, { tableCode, tableName })
      };
    });
    return list;
  }

  constructColumnList = (columns, { tableCode, tableName }) => {
    const list = columns.map(item=>{
      const { name: columnName, id: columnId, code: columnCode } = item;
      return { id: columnId, columnName, columnId, columnCode, tableCode, tableName,  name: columnName, };
    });
    return list;
  }
  
  handleSetValue = (_r, changeArea) => {
    const { tableCode, columnCode, tableName, columnName } = _r;
    const { changeFields } = this.state;
    const notEmpty = Object.values(changeArea).filter(item=>!!item).length > 0;
    if(notEmpty){
      this.setState({
        changeFields: {
          ...changeFields,
          [tableCode+'.'+columnCode]: { ...changeArea, tableName, columnName }
        }
      });
    }else {
      const { [tableCode+'.'+columnCode]: currentOne, ...rest } = changeFields;
      this.setState({
        changeFields: rest
      });
    }
  }

  handleReset = () => {
    this.getColumnList();
    this.setState({
      changeFields: {}
    });
  }

  handleCancel = () => {
    this.props.onCancel();
  }
  handleSubmit = () => {
    const { changeFields } = this.state;
    if(Object.values(changeFields).length === 0){
      this.props.onSuccess(null, '');
    }
    const submitTitle = this.getSubmitTitle();
    this.props.onSuccess(changeFields, submitTitle);
  }
  getSubmitTitle = () => {
    const { changeFields } = this.state;
    const list = [];
    for(const key in changeFields){
      const { tableName, columnName } = changeFields[key];
      list.push(`${tableName}.${columnName}`);
    }
    return list.join('，');
  }
  render(){
    const { treeList, changeFields, variableData } = this.state;
    return <>
      <Table
        size="small"
        scroll={{ y: 440 }}
        columns={[{
          dataIndex: 'name',
          key: 'name',
          title: '字段名',
        }, {
          dataIndex: 'valueConfig',
          key: 'valueConfig',
          title: '值',
          render: (_t, _r)=>{
            const { tableCode, columnCode } = _r;
            return columnCode ? (
              <ValueHelper 
                variableData = {variableData}
                editedState = {changeFields[tableCode+'.'+columnCode] || {}}
                onChange={(changeArea)=>{
                  this.handleSetValue(_r, changeArea);
                }}
              />
            ) : null;
          }
        }]}
        rowKey="id"
        dataSource={treeList}
        pagination={false}
      />
      <Space className="float-right" style={{ height: 52 }}>
        <Button htmlType="button" onClick={this.handleReset}>
      清空
        </Button>
        <Button type="primary" onClick={this.handleSubmit}>
      确定
        </Button>
        <Button htmlType="button" onClick={this.handleCancel}>
      取消
        </Button>
      </Space>
    </>;
  }
}