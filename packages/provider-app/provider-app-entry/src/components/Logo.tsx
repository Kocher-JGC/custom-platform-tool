import React from "react";
import { Icon } from "@deer-ui/core/icon";

export const Logo = ({ appName = "自定义工具 3.0", isEntryApp, ...props }) => {
  return (
    <div {...props}>
      <div className="px-4 text-xl flex items-center cursor-pointer logo-container">
        {isEntryApp ? (
          <Icon n="chevron-left" className="text-2xl" />
        ) : (
          <Icon n="gas-pump" className="text-2xl" />
        )}
        <span className="ml-2">{appName}</span>
      </div>
    </div>
  );
};
