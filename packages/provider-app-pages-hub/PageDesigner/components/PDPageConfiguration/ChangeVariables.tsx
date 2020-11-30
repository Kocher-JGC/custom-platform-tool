import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import lowerFirst from 'lodash/lowerFirst';
import { VariableItem } from '@provider-app/page-designer/platform-access';
import { ValueHelper } from '@provider-app/page-designer/components/PDInfraUI';
import { BasicValueMeta } from '@engine/visual-editor/data-structure';
export enum VarAttrTypeMap {
  string = '字符串',
  number = '数字',
  date='日期',
  dateTime='日期时间'
}
interface Props {
  platformCtx
  config: {[key: string]: BasicValueMeta}
  onSuccess: (param1: {[key: string]: BasicValueMeta} | null, param2: string) => void
  onCancel: () => void
}
type VariableRecord = {title: string, id: string, children: VariableItem[]}
type GetVariableList = (options: {[key: string]: VariableItem[]}) => VariableRecord[]
export const ChangeVariables = ({
  platformCtx, config: changeVariables, onSuccess, onCancel
}: Props) => {
  const varTypeAllowChange = ['customed','widget'];
  const [variableList, setVariableList] = useState<VariableRecord[]>([]);
  /** 当前页面变量数据 */
  const [variableData, setVariableData] = useState<{[key: string]: VariableItem[]}>({});
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [changeArea, setChangeArea] = useState({});

  /** 
   * 实时读取最新变量列表
   */
  const getVariableList: GetVariableList = (variableData) => {
    return [
      { title: '自定义变量', id:'customed', children: variableData.customed },
      { title: '控件变量', id: 'widget', children: variableData.widget },
    ].filter(item=>item.children?.length > 0);
  };

  useEffect(()=>{
    initVariableList();
    setChangeArea(changeVariables || {});
    /** 获取当前页面变量 */
    platformCtx.meta.getVariableData([]).then(res=>{
      setVariableData(res);
    });    
  },[]);
  const getSubmitTitle = (submitArea) => {
    if(!submitArea) return '';
    const title = [...(variableData.customed || []), ...(variableData.widget|| [])]
      .filter(item => item.id in submitArea)
      .map(item => item.title)
      .join(',');
    return title;
  }; 
  const getSubmitArea = () => {
    const hasItemChanged = (item) => {
      return ['exp', 'realVal', 'variable'].some(key=>!!item[key]);
    };
    const result = {};
    for(const key in changeArea){
      const item = changeArea[key];
      const hasIChanged = hasItemChanged(item);
      if(hasIChanged){
        result[key] = item;
      }
    }
    return Object.keys(result).length > 0 ? result : null;
  };
  const handleSubmit = () => {
    const submitArea = getSubmitArea();
    const submitTitle = getSubmitTitle(submitArea);
    typeof onSuccess === 'function' && onSuccess(submitArea, `更改：${submitTitle}`);
  };
  const handleReset = () => {
    setChangeArea({});
  };
  const handleCancel = () => {
    onCancel();
  };

  /** 
   * 初始化变量列表 
   */
  const initVariableList = () => {
    platformCtx.meta.getVariableData(['page', 'pageInput']).then(res=>{
      setVariableList(getVariableList(res));
      setExpandedKeys(varTypeAllowChange);
    });
  };
  return (
    <div className="page-change-variables">
      <Table
        columns={[
          {
            dataIndex: 'title',
            title: '变量名称',
            ellipsis: { showTitle: true },
            className: 'cursor-pointer',
            width: 200,
          },
          {
            dataIndex: 'code',
            title: '变量编码',
            ellipsis: { showTitle: true },
            className: 'cursor-pointer',
            width: 200,
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
            dataIndex: 'id',
            title: '值',
            width: 320,
            render: (_t)=>{
              return varTypeAllowChange.includes(_t) ? null : (
                <ValueHelper
                  editedState = {changeArea[_t] || {}}
                  onChange={(changeVariable)=>{
                    setChangeArea({
                      ...changeArea,
                      [_t]: changeVariable
                    });
                  }}              
                  variableData = {variableData}
                />
              );
            }
          }
        ]}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpand: (expanded, record)=>{
            if(expanded){
              setExpandedKeys([record.id, ...expandedKeys]);
            }else {
              setExpandedKeys(expandedKeys.filter(item=>item!==record.id));
            }
          }
        }}
        scroll={{ y: 440 }}
        pagination={false}
        size="small"
        dataSource={variableList}
        rowKey="id"
      />
      <div className="flex mt-2">
        <div className="flex"></div>
        <Button htmlType="button" className="mr-2" onClick={handleReset}>
            清空
        </Button>
        <Button
          className="mr-2" 
          type="primary"
          onClick={handleSubmit}
        >确定</Button>
        <Button
          htmlType="button" 
          onClick={handleCancel}
        >
            取消
        </Button>
      </div>
    </div>
  );
};
