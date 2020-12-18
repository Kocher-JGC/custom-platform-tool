// import { LogoutOutlined } from "@ant-design/icons";
import React from "react";
import { Icon } from "@deer-ui/core/icon";
import { DropdownWrapper } from "@deer-ui/core/dropdown-wrapper";
import { List } from "antd";
import { Version } from "../Version";

export const UserStatusbar = ({ logout, username }) => {
  return (
    <div className="px-2">
      <DropdownWrapper
        position="right"
        withInput={false}
        overlay={(hide) => {
          return (
            <List style={{ width: 400 }} footer={<Version />} bordered>
              <List.Item>{username}</List.Item>
              <List.Item onClick={logout}>退出登录</List.Item>
            </List>
          );
        }}
      >
        <span>
          <Icon n="skiing" className="px-2" />
          {username}
        </span>
      </DropdownWrapper>
    </div>
  );
};
