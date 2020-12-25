import { UpdateStateOptions } from "@iub-dsl/definition/actions";
import { ActionDoFn } from "../types";
import { DispatchModuleName, DispatchMethodNameOfIUBStore, RunTimeCtxToBusiness } from "../../runtime/types";
import { isRunCtx, pickSchemaMark, isSchema } from "../../IUBDSL-mark";

/**
 * 最重要的问题: 流程和隔离
 * 单个action和多个action
 * 事件触发、标准输入「action输入是标准输入」
 * 1. 需要用到标准输入得, 不需要用到标准输入得
 * 2. 配置流程中的上下文的「流程引擎中识别」
 */
export const changeStateAction = (conf, baseActionInfo): ActionDoFn => {
  // 更新状态动作的配置和定义
  const { changeMapping, propsChangeMapping } = conf;
  if (changeMapping && typeof changeMapping === 'function') {
    return async (ctx: RunTimeCtxToBusiness) => {
      const { asyncDispatchOfIUBEngine, dispatchOfIUBEngine } = ctx;
      const changeVal = await changeMapping(ctx);
      asyncDispatchOfIUBEngine({
        dispatch: {
          module: DispatchModuleName.IUBStore,
          method: DispatchMethodNameOfIUBStore.mappingUpdateState,
          params: [changeVal]
        }
      });
    };
  }
  if (propsChangeMapping) {
    return async (ctx: RunTimeCtxToBusiness) => {
      const { asyncDispatchOfIUBEngine, action: { payload } } = ctx;
      let changeStruct = payload?.changeStruct;
      if (changeStruct) {
        changeStruct = changeStruct.map(({ val, key }) => ({ [key]:val }));
        asyncDispatchOfIUBEngine({
          dispatch: {
            module: DispatchModuleName.IUBStore,
            method: DispatchMethodNameOfIUBStore.mappingUpdateState,
            params: [changeStruct]
          }
        });
      }
    };
  }
  return async () => {
    console.log(changeMapping);
  };
};
