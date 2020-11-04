import { Modal, Form, Input } from 'antd';
import React from 'react';
import { OpenModalOptions } from '@iub-dsl/definition';
import { IUBDSLRenderer } from '@iub-dsl/platform/react';
import { queryPageData } from '@consumer-app/web-platform/src/services/page';
import D from '@iub-dsl/demo/pd/2';
import { PageVariable } from '@iub-dsl/definition/page-variable';
import { ActionDoFn } from '../../types';
import { DispatchModuleName, DispatchMethodNameOfIUBStore } from '../../../runtime/types';
import { genPageVariableOfTable, genPageCommunication, pageCommunicationReceiver } from '../../../page-variable';

/**
 * 单通道处理, 在mounted
 * 多通道处理, 在asyncDispatchOfIUBEngine
 * 标准通讯, 获取转换的数据, 转换数据, 写入数据
 */

/** 整体都有问题 */
export const openModelFromTable = (conf: OpenModalOptions, baseActionInfo): ActionDoFn => {
  // const {
  //   actionOptions: {
  //   },
  // } = conf;

  const pageUrl = '1321030671367544832';
  return async ({
    pageId, action, pageMark, dispatchOfIUBEngine
  }) => {
    const {
      type, payload: { schemasPatch, pageStatus }
    } = action;
    const variableData: PageVariable[] = [];

    /** 获取相应的元数据 */
    const metadataToUse = dispatchOfIUBEngine({
      dispatch: {
        module: DispatchModuleName.IUBStore,
        method: DispatchMethodNameOfIUBStore.getSchemaMetadata,
        params: [schemasPatch]
      }
    });
    console.log(metadataToUse);
    // TODO:
    const PK = metadataToUse[0].PKInfo?.fieldCode;
    /** 事件变量 */
    if (type === 'antTableRowClick') {
      variableData.push(
        genPageVariableOfTable(action.payload, { PK, metaDataRef: [0] })
      );
    }
    // 1. 获取和转换数据
    /** 页面通讯, 配置的变量 */
    // TODO:
    const pageCommunication = genPageCommunication({
      pageInfo: { pageId, pageMark },
      metadata: metadataToUse,
      variableData
    });
    console.log(pageCommunication);

    const IUBRendererHooks = {
      // 2. 弹窗, 传输数据 「钩子+ctx」
      mounted({
        pageMark: newPageMark,
        runTimeCtxToBusiness: {
          current
        }
      }) {
        // 3. 数据传输指定处理
        pageCommunicationReceiver(current, pageCommunication);
      }
    };
    if (pageUrl) {
      try {
        // const pageData = await queryPageData({ id: pageUrl });
        const mInstance = Modal.confirm({
          icon: false,
          content: <IUBDSLRenderer hooks={IUBRendererHooks} pageStatus={pageStatus} dsl={D} />
        });
        // console.log(mInstance);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error('无pageUrl');
    }
  };
};
