import { Modal, Form, Input } from 'antd';
import React from 'react';
import { OpenModalFromTableClick } from '@iub-dsl/definition';
import { IUBDSLRenderer } from '@iub-dsl/platform/react';
import { queryPageData } from '@consumer-app/web-platform/src/services/page';
import { ActionDoFn } from '../../types';
import { DispatchModuleName } from '../../../runtime/types';

export const openModelFromTable = (conf: OpenModalFromTableClick, baseActionInfo): ActionDoFn => {
  // const {
  //   actionOptions: {
  //   },
  // } = conf;
  const pageUrl = '1321030671367544832';
  return async ({ action, pageMark, asyncDispatchOfIUBEngine }) => {
    const IUBRendererHooks = {
      mounted() {
        asyncDispatchOfIUBEngine({
          dispatch: {
            module: DispatchModuleName.sys,
            method: 'pageBroadcast',
            params: [{
              pageIdOrMark: pageUrl, //
              /** 获取其他页面上下文的信息,  缺少一个其他页面的接受者 */
              receiveHandle: (ctx) => {
                console.log(ctx);
              }
            }],
          }
        });
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
        console.log(mInstance);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error('无pageUrl');
    }
  };
};
