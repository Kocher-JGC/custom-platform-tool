import { Modal, Form, Input } from 'antd';
import React from 'react';
import { OpenModalFromTableClick } from '@iub-dsl/definition';
import { IUBDSLRenderer } from '@iub-dsl/platform/react';
import { queryPageData } from '@consumer-app/web-platform/src/services/page';
import { ActionDoFn } from '../../types';

export const openModelFromTable = (conf: OpenModalFromTableClick, baseActionInfo): ActionDoFn => {
  // const {
  //   actionOptions: {
  //   },
  // } = conf;
  const pageUrl = '1321030671367544832';
  return async ({ action, pageMark, asyncDispatchOfIUBEngine }) => {
    const IUBRendererHooks = {
      mounted() {
        console.log(pageMark);

        console.log(action);
      }
    };
    if (pageUrl) {
      try {
        const pageData = await queryPageData({ id: pageUrl });
        const mInstance = Modal.confirm({
          icon: false,
          content: <IUBDSLRenderer hooks={IUBRendererHooks} dsl={pageData} />
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error('无pageUrl');
    }

    // if (pageUrl) {
    //   try {
    //     const pageData = await queryPageData({ id: pageUrl });
    //     Modal.confirm({
    //       icon: false,
    //       content: <IUBDSLRenderer dsl={pageData} />
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
