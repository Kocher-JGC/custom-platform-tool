import { GoogleOutlined, LeftOutlined } from '@ant-design/icons';
import React from 'react';

export const Logo = ({
  app,
  appName = '自定义工具 3.0.1233211111',
  isEntryApp,
  ...props
}) => {
  return (
    <div {...props}>
      <div
        className="px-4 text-xl flex items-center cursor-pointer logo-container"
      >
        {
          isEntryApp ? <LeftOutlined className="text-2xl" /> : <GoogleOutlined />
        }
        <span className="ml-2">
          {appName}
        </span>
      </div>
    </div>
  );
};
