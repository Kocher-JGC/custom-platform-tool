/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from 'react';
import {
  Dropdown, Menu, Button, message
} from 'antd';

function handleButtonClick(e) {
  message.info('Click on left button.');
  console.log('click left button', e);
}

const menu = (
  <Menu onClick={(e) => {}}>
    <Menu.Item key="1">
      1st menu item
    </Menu.Item>
    <Menu.Item key="2">
      2nd menu item
    </Menu.Item>
    <Menu.Item key="3">
      3rd menu item
    </Menu.Item>
  </Menu>
);

export const DropdownSelectorComp = ({
  title,
  value,
}) => {
  return (
    <Dropdown overlay={menu}>
      <Button>
        {title}
      </Button>
    </Dropdown>
  );
};
