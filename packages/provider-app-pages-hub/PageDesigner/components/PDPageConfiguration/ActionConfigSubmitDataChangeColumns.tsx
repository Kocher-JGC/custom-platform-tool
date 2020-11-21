import React from 'react';
import { Table } from 'antd';
import pick from 'lodash/pick';
export class ActionConfigSubmitDataChangeColumns extends React.PureComponent {
  state = {
    treelist: [],
    treeMap: {}
  }
  componentDidMount(){
    this.getColumnList();
  }
  getColumnList = () => {
    return new Promise((resolve, reject)=>{
      $R_P.post({
        url: '/data/v1/tables/tableWithAux',
        data: { tables: [{
          tableId: this.props.data.tableId,
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
        const { id: columnId } = column;
        map[tableId+'.'+columnId] = column;
      });
    });
    return map;
  }
  constructTableList = (tables) => {
    const list = tables.map(item => {
      debugger;
      return {
        ...pick(item, ['name', 'id', 'code']),
        children: this.constructColumnList(item.columns)
      };
    });
    return list;
  }

  constructColumnList = (columns) => {
    const list = columns.map(item=>{
      return pick(item, ['name', 'id', 'code']);
    });
    console.log(list);
    return list;
  }
  render(){
    const { treeList } = this.state;
    return <>

      <Table
        columns={[{
          dataIndex: 'name',
          key: 'name',
          title: '字段名',
          // }, {
          //   dataIndex: 'valueConfig',
          //   key: 'valueConfig',
          //   title: '值',
          //   render: (_t, _r)=>{

        //   }
        }]}
        rowKey="id"
        dataSource={treeList}
        pagination={false}
      />
    </>;
  }
}