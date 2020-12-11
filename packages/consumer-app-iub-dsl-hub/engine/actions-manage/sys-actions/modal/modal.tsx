import {
  Modal
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { OpenModalOptions } from '@iub-dsl/definition';
import { IUBDSLRenderer } from '@iub-dsl/platform/react';
// import { queryPageData } from '@consumer-app/web-platform/src/services/page';
import D from '@iub-dsl/demo/pd/2';
import { ActionDoFn } from '../../types';

const enum ModalType {
  info = 'info',
  success = 'success',
  error = 'error',
  warn = 'warn',
  warning = 'warning',
  confirm = 'confirm'
}

export const openModal = (conf: OpenModalOptions, baseActionInfo): ActionDoFn => {
  const {
    type,
    pageUrl
  } = conf;
  return async ({ action, asyncDispatchOfIUBEngine }) => {
    // const IUBRendererHooks = {
    //   mounted() {
    //   }
    // };
    // if (pageUrl) {
    //   try {
    //     const pageData = await queryPageData({ id: pageUrl });
    //     const m = Modal.confirm({
    //       title: <div style={{ textAlign: 'right' }}><CloseOutlined onClick={() => {
    //         m.destroy();
    //       }}
    //       /></div>,
    //       icon: false,
    //       cancelButtonProps: { style: { display: 'none' } },
    //       okButtonProps: { style: { display: 'none' } },
    //       content: <IUBDSLRenderer hooks={IUBRendererHooks} dsl={pageData} />
    //     });
    //   } catch (e) {
    //     console.error(e);
    //   }
    // } else {
    //   console.error('无pageUrl');
    // }
    // const { userForm } = await import('@iub-dsl/demo/base-reference/user/userfrom');
    // console.log(userForm);
    // Modal.confirm({
    //   icon: false,
    //   content: <IUBDSLRenderer dsl={userForm} />
    // });
    // Modal[ModalType.confirm]({
    //   title: '测试弹窗',
    //   content: <div>你猜猜</div>
    // });
  };
};
