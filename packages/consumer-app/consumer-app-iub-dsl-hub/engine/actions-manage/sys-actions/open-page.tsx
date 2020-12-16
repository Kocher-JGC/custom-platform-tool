import React from "react";
import { ShowModal } from "@deer-ui/core/modal";
import { OpenType, PageType } from "@iub-dsl/definition";
import { ActionDoFn } from "../types";
import {
  DispatchModuleName,
  DispatchMethodNameOfIUBStore,
  RunTimeCtxToBusiness,
} from "../../runtime/types";
import { isRunCtx, pickSchemaMark, isSchema } from "../../IUBDSL-mark";

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
  const { pageArea, openType, pageUrl, paramMatch } = conf;
  return async (IUBCtx: RunTimeCtxToBusiness) => {
    const { PageRenderer, pkSchemaRef, asyncDispatchOfIUBEngine } = IUBCtx;
    const data = (await paramMatch(IUBCtx)) || {};
    /** 额外添加的数据, 仅有修改时候才添加 */
    const pageStatus = data["@(schema).pageInput.0.mode"];
    if (
      Array.isArray(pkSchemaRef) &&
      pageStatus === "update" /** 临时的额外逻辑 */
    ) {
      const extraData = await asyncDispatchOfIUBEngine({
        dispatch: {
          module: DispatchModuleName.IUBStore,
          method: DispatchMethodNameOfIUBStore.getPageState,
          params: [
            pkSchemaRef.slice(0).reduce((res, k) => ({ ...res, [k]: k }), {}),
          ],
        },
      });
      Object.assign(data, extraData);
    }
    /** 默认获取ID */
    const hooks = {
      mounted: async ({ runTimeCtxToBusiness: subIUBCtx }) => {
        const { asyncDispatchOfIUBEngine: dispath } = subIUBCtx.current;
        subIUBCtx.current.pageStatus = pageStatus;
        await dispath({
          dispatch: {
            module: DispatchModuleName.IUBStore,
            method: DispatchMethodNameOfIUBStore.mappingUpdateState,
            params: [data],
          },
        });
      },
    };
    if (openType === OpenType.openModal) {
      ShowModal({
        children: () => <PageRenderer hooks={hooks} pageId={pageUrl} />,
      });
    }
  };
};
