import React, { useEffect, useState } from 'react';
import {
  CloseModal, Input, ShowModal, Select, TreeSelector
} from '@infra/ui';
import { ExpEditor } from './ExpEditor';
import './style.scss';
import { VariableItem } from '@provider-app/page-designer/platform-access';
/**
 * 可用的值的类型
 */
const SELECT_TYPE_MENU = [
  { label: '自定义', value: 'realVal', key: 'realVal' },
  { label: '表达式', value: 'exp', key: 'exp' },
  { label: '变量', value: 'variable', key: 'variable' },
];
/**
 * ValueHelperProps
 */
interface ValueHelperProps {
  editedState
  onChange
  variableData: {[key: string]: VariableItem[]}
}

interface VariableItemInState {
  title: string,
  value: string,
  disabled?: boolean
}

interface VariableListInState extends VariableItemInState{
  children?: VariableItemInState[]
}
/**
 * ValueHelper
 * @param param0
 */
export const ValueHelper: React.FC<ValueHelperProps> = ({
  variableData,
  editedState,
  onChange,
}) => {
  const [selectedItem, setSelectedItem] = useState('realVal');
  const [variableList, setVariableList] = useState<VariableListInState[]>([]);
  const { exp, realVal, variable } = editedState;
  let Comp;
  switch (selectedItem) {
    case 'realVal':
      Comp = (
        <Input 
          className="custom-value"
          value={realVal || ''}
          onChange={(value) => onChange({
            exp: null,
            realVal: value,
            variable: null
          })}
        />
      );
      break;
    case 'exp':
      Comp = (
        <span
          className="border cursor-pointer exp-editor"
          onClick={(e) => {
            const modalID = ShowModal({
              title: '设置表达式',
              width: 900,
              children: () => {
                return (
                  <div>
                    <ExpEditor
                      defaultValue={exp}
                      onSubmit={(val) => {
                        onChange({
                          exp: val,
                          realVal: null,
                          variable: null
                        });
                        CloseModal(modalID);
                      }}
                    />
                  </div>
                );
              }
            });
          }}
        >
          {exp ? '已设置表达式' : '点击设置表达式'}
        </span>
      );
      break;
    case 'variable':
      Comp = (
        <TreeSelector 
          value={variable || ''}
          className="variable-selector py-1 cursor-pointer"
          showSearch
          onSearch={(value)=>{

          }}
          onChange={(value) => onChange({
            exp: null,
            realVal: null,
            variable: value
          })}
          treeDefaultExpandAll
          treeData = {variableList}
        />
      );
      break;
  }
  const initVariableList = () => {
    const constructVarList = (list: VariableItem[])=>{
      return Array.isArray(list) ? list.map(item=>constructVarItem(item)) : [];
    };
    const constructVarItem = (item: VariableItem) => {
      const { id, title } = item;
      return { value: id, title };
    };
    return [
      { title: '自定义变量', value: 'customed', variableList: variableData.customed, disabled: true },
      { title: '页面变量', value: 'page', variableList: variableData.page, disabled: true },
      { title: '系统变量', value: 'system', variableList: variableData.system, disabled: true },
      { title: '控件变量', value: 'widget', variableList: variableData.widget, disabled: true },
      { title: '输入参数变量', value: 'pageInput', variableList: variableData.pageInput, disabled: true }
    ].filter(item=>item.variableList?.length>0).map(item=>{
      const { variableList, ...rest } = item;
      return { ...rest, children: constructVarList(variableList) };
    });
  };
  useEffect(() => {
    // const selectedKey = 'customValue'; 
    const keyMenu = SELECT_TYPE_MENU.map(item=>item.value);
    for(const key in editedState){
      if(!editedState[key] || !keyMenu.includes(key)) continue;
      setSelectedItem(key);
    }
    setVariableList(initVariableList());
  }, []);
  return (
    <div className="value-helper">
      <span>
        {Comp}
      </span>
      <span className="value-type-selector">
        <Select
          options={SELECT_TYPE_MENU}
          onChange={(val) => setSelectedItem(val)}
          value={selectedItem}
        />
      </span>
    </div>
  );
};
