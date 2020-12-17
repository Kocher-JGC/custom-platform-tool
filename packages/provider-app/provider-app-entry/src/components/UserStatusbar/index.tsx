// import { LogoutOutlined } from "@ant-design/icons";
import React from "react";
import { Icon } from "@deer-ui/core/icon";

export const UserStatusbar = ({ logout }) => {
  return (
    <Icon
      n="circle-notch"
      onClick={logout}
      className="user-statusbar ps20 text-gray-100"
    />
  );
};
