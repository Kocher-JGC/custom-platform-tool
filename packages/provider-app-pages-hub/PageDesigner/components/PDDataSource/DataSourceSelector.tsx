import React, { useState } from 'react';
import { Tabs, Button } from 'antd';
// import { wrapInterDatasource } from '../../services/datasource';
import { TableSelector } from './TableSelector';
import { DictSelector } from './DictSelector';
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
  bindedDataSources: ({id: string, type: string, name: string})[]
  /** 是否单选 */
  single?: boolean
  typeArea: ('TABLE' | 'DICT')[]
  typeSingle?: boolean
}
const tabPaneTitle = {
  TABLE: '数据表',
  DICT: '字典'
};
export const DataSourceSelector: React.FC<DataSourceBinderProps> = (props) => {
  const { bindedDataSources = [], single = false, typeSingle = false, typeArea, onSubmit } = props;
  const [selectedInfo, setSelectedInfo] = useState(bindedDataSources);
  
  const handleSubmit = (type, data) => {
    data = data.map(item=>({ ...item, type }));
    const filterByType = () => {
      return selectedInfo.filter(item=>item.type !== type);
    };
    if(!typeSingle){
      return setSelectedInfo([...filterByType(), ...data]);
    }
    setSelectedInfo(data);
  };
  const tableSelectorRenderer = ()=>{
    return (<TableSelector 
      single = {single}
      defaultSelectedInfo = {selectedInfo.filter(item=>item.type === 'TABLE')}
      onSubmit={(tableData)=>{
        handleSubmit('TABLE', tableData);
      }}
    />);
  };
  const dictSelectorRenderer = () => {
    return (
      <DictSelector 
        single = {single}
        defaultSelectedInfo = {selectedInfo.filter(item=>item.type === 'DICT')}
        onSubmit = {(dictData)=>{
          handleSubmit('DICT', dictData);
        }}
      />
    );
  };
  const Renderer = ({ type, ...rest }) => {
    let comp;
    switch(type){
      case 'TABLE':
        comp = (
          <TableSelector {...rest}/>
        );break;
      case 'DICT':
        comp = <DictSelector {...rest}/>; break;
    }
    return comp || null;
  };
  return (
    <ConfigProvider locale={zhCN}>
      <div className="data-source-binder p20">
        {typeArea.length > 1 ? (
          <Tabs 
            tabPosition = "left"
          >
            {typeArea.map(item=>(
              <TabPane tab={tabPaneTitle[item]} key={item}>
                {Renderer({
                  type: item,
                  single: single,
                  defaultSelectedInfo: selectedInfo.filter(item=>item.type === item),
                  onSubmit: (dictData)=>{
                    handleSubmit(item, dictData);
                  }
                })}
              </TabPane>
            ))}
          </Tabs>
        ): Renderer({
          type: typeArea[0],
          single: single,
          defaultSelectedInfo: selectedInfo.filter(item=>item.type === typeArea[0]),
          onSubmit: (dictData)=>{
            handleSubmit(typeArea[0], dictData);
          }
        })
        }
        <Button
          onClick={(e) => {
          // const submitData = getItem(list, selectedRowKeys);
            wrapInterDatasource(selectedInfo).then(({ remoteData, decorativeData })=>{
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
