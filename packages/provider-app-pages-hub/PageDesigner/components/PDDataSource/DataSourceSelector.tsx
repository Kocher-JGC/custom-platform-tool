import React, { useEffect, useState } from 'react';
import { queryTableListService } from '@provider-app/table-structure/service';
import { Tabs, Button } from 'antd';
import { getDictionaryListServices } from '@provider-app/services';
// import { wrapInterDatasource } from '../../services/datasource';
import { TableSelector } from './TableSelector';
import { DictSelector, DictSubItems } from './DictSelector';
import { wrapInterDatasource } from './utils';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
const { TabPane } = Tabs;

interface SubmitItem {
  id: string
  type: string
}

interface DataSourceBinderProps {
  onSubmit: (submitItems: SubmitItem[], interDatasources: PD.Datasources) => void
  bindedDataSources: ({id: string, type: string})[]
  /** 是否单选 */
  single?: boolean
  typeArea: ('TABLE' | 'DICT')[]
  typeSingle?: boolean
}



interface SelectedRowInfo {
  keys: string[]
  rowItems: any[]
}
// const interDatasources = await takeDatasources(addingDataFormRemote);
// const nextDSState = {};
// interDatasources.forEach((dsItem, idx) => {
//   nextDSState[this.genDatasourceMetaID(idx)] = dsItem;
// });

export const DataSourceSelector: React.FC<DataSourceBinderProps> = (props) => {
  const { bindedDataSources = [], single = false, typeSingle = false, typeArea, onSubmit } = props;
  const [selectedInfo, setSelectedInfo] = useState(bindedDataSources)
  
  const handleSubmit = (type, data) => {
    data = data.map(item=>({...item, type}));
    const filterByType = () => {
      return selectedInfo.filter(item=>item.type !== type)
    }
    if(!typeSingle){
      return setSelectedInfo([...filterByType(), ...data])
    }
    setSelectedInfo(data)
  }
  return (
    <ConfigProvider locale={zhCN}>
    <div className="data-source-binder p20">
      <Tabs 
        tabPosition = "left">
        {typeArea.includes("TABLE") ? (
          <TabPane tab="数据表" key="TABLE">
            <TableSelector 
              single = {single}
              defaultSelectedInfo = {selectedInfo.filter(item=>item.type === 'TABLE')}
              onSubmit={(tableData)=>{
                handleSubmit('TABLE', tableData)
              }}
            />
          </TabPane>
        ) : null }
        {typeArea.includes("DICT") ? (
          <TabPane tab="字典" key="DICT">
            字典
          </TabPane>
        ) : null }
      </Tabs>
      <Button
        onClick={(e) => {
          // const submitData = getItem(list, selectedRowKeys);
          wrapInterDatasource(selectedInfo).then(({remoteData, decorativeData})=>{
            onSubmit(remoteData, decorativeData);
          });          
        }}
      >
        确定
      </Button>
    </div>
    </ConfigProvider>
  );
};
