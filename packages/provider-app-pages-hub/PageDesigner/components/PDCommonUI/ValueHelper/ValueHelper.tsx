import React, { useEffect } from 'react';
import {
  CloseModal, Input, ShowModal
} from '@infra/ui';
import { ExpEditor } from './ExpEditor';
import { Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

/**
 * 可用的值的类型
 */

const DROPDOWN_MENU = [
  { label: '自定义', key: 'costomValue', value: 'costomValue' },
  { label: '表达式', key: 'expression', value: 'expression' },
  { label: '变量', key: 'variable', value: 'variable' }
];

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
  const [selectedItem, setSelectedItem] = React.useState('costomValue');
  const { exp, realVal, variable } = editedState;
  let Comp;
  switch (selectedItem) {
    case 'costomValue':
      Comp = (
        <Input
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
    // const selectedKey = 'costomValue'; 
    const keyMenu = DROPDOWN_MENU.map(item=>item.value);
    for(const key in editedState){
      if(!editedState[key] || !keyMenu.includes(key)) continue;
      setSelectedItem(key);
    }
  }, []);
  const menu = (
    <Menu onClick={item=>{
      setSelectedItem(item.key);
    }}
    >
      {DROPDOWN_MENU.map(item=>{
        return (
          <Menu.Item key={item.key} className={selectedItem === item.key ? 'ant-menu-item-selected' : ''}>
            {item.label}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <div className="value-helper">
      <span>
        {Comp}
      </span>
      <Dropdown overlay={menu} className="p-2 cursor-pointer">
        <EllipsisOutlined  style={{ verticalAlign: '0.125em' }}/>
      </Dropdown>
    </div>
  );
};
