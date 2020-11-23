import React, { useEffect } from 'react';
import {
  CloseModal, Input, ShowModal, Selector
} from '@infra/ui';
import { ExpEditor } from './ExpEditor';
import './style.scss';

/**
 * 可用的值的类型
 */

const DROPDOWN_MENU = [
  { label: '自定义', key: 'customValue', value: 'customValue' },
  { label: '表达式', key: 'expression', value: 'expression' },
  { label: '变量', key: 'variable', value: 'variable' }
];
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
}

/**
 * ValueHelper
 * @param param0
 */
export const ValueHelper: React.FC<ValueHelperProps> = ({
  editedState,
  onChange,
}) => {
  const [selectedItem, setSelectedItem] = React.useState('customValue');
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
          className="px-4 py-2 border"
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

      break;
  }
  useEffect(() => {
    // const selectedKey = 'customValue'; 
    const keyMenu = Object.keys(selectTypes);
    for(const key in editedState){
      if(!editedState[key] || !keyMenu.includes(key)) continue;
      setSelectedItem(key);
    }
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
