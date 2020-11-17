import React from 'react';
import { message } from 'antd';
import { PlatformUICtx } from '@platform-widget-access/spec';

const PDUICtx: PlatformUICtx = {
  utils: {
    showMsg: (ctx) => {
      const { msg, type } = ctx;
      message[type](msg);
    }
  },
  openDatasourceSelector: () => {
    
  }
};

export default PDUICtx;
