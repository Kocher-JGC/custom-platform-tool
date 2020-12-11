import React from 'react';
import { ShowModal } from '@deer-ui/core/modal';
import { ActionDoFn } from "../types";
import { DispatchModuleName, DispatchMethodNameOfIUBStore, RunTimeCtxToBusiness } from "../../runtime/types";
import { isRunCtx, pickSchemaMark, isSchema } from "../../IUBDSL-mark";
import { OpenType, PageType } from "@iub-dsl/definition";

/**
 * OpenType 如何打开这个页面
 * 1. 模态框
 * 2. 替换当前页
 * 3. 应用内tab页
 * 4. 浏览器内tab
 */
/**
 * PageType 打开这个页面的类型
 * 1. IUBDSL
 */

export const openPageAction = (conf, baseActionInfo): ActionDoFn => {
  const { pageArea, openType, pageUrl } = conf;
  return async (IUBCtx: RunTimeCtxToBusiness) => {
    const { PageRenderer } = IUBCtx;
    if (openType === OpenType.openModal ) {
      ShowModal({
        children: () => <PageRenderer pageId={pageUrl} />,
      });
    }
    console.log(conf);
  };
};
