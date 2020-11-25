import React, { useEffect, useState } from 'react';
import {
  CloseModal, Input, ShowModal, Selector, TreeSelector
} from '@infra/ui';
import { ExpEditor } from './ExpEditor';
import './style.scss';
import { VariableItem } from '@provider-app/page-designer/platform-access';
/**
 * 可用的值的类型
 */
const selectTypes = {
  customValue: '自定义',
  expression: '表达式',
  variable: '变量',
};
/**
 * ValueHelperProps
 */
interface ValueHelperProps {
  editedState
  onChange
  variableData: {[key: string]: VariableItem[]}
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
  const [selectedItem, setSelectedItem] = useState('customValue');
  const [variableList, setVariableList] = useState([]);
  const { exp, realVal, variable } = editedState;
  let Comp;
  switch (selectedItem) {
    case 'customValue':
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
    case 'expression':
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
          className="variable-selector py-1"
          showSearch
          onSearch={(value)=>{

          }}
          treeDefaultExpandAll
          treeData = {variableList}
        />
      );
      break;
  }
  const constructVars = () => {
    return [
      { title: '自定义变量', value: 'customed', children: constructVarList(variableData.customed), disabled: true },
      { title: '页面变量', value: 'page', children: constructVarList(variableData.page), disabled: true },
      { title: '系统变量', value: 'system', children: constructVarList(variableData.system), disabled: true },
      { title: '控件变量', value: 'widget', children: constructVarList(variableData.widget), disabled: true },
      { title: '输入参数变量', value: 'pageInput', children: constructVarList(variableData.pageInput), disabled: true }
    ];
  };
  const constructVarList = (list)=>{
    return Array.isArray(list) ? list.map(item=>constructVarItem(item)) : [];
  };
  const constructVarItem = (item) => {
    const { id, alias } = item;
    return { value: id, title: alias };
  };
  useEffect(() => {
    // const selectedKey = 'customValue'; 
    const keyMenu = Object.keys(selectTypes);
    for(const key in editedState){
      if(!editedState[key] || !keyMenu.includes(key)) continue;
      setSelectedItem(key);
    }
    setVariableList(constructVars());
  }, []);
  return (
    <div className="value-helper">
      <span>
        {Comp}
      </span>
      <span className="value-type-selector">
        <Selector
          needCancel={false}
          value={selectedItem}
          values={selectTypes}
          onChange={(val) => setSelectedItem(val)}
        />
      </span>
      
      {/* <Dropdown overlay={menu} className="p-2 cursor-pointer">
        <EllipsisOutlined  style={{ verticalAlign: '0.125em' }}/>
      </Dropdown> */}
    </div>
  );
};
