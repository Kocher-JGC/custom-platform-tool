import { UpdateStateOptions } from "@iub-dsl/definition/actions";
import { ActionDoFn } from "../types";
import { DispatchModuleName, DispatchMethodNameOfIUBStore, RunTimeCtxToBusiness } from "../../runtime/types";

/**
 * 最重要的问题: 流程和隔离
 * 单个action和多个action
 * 事件触发、标准输入「action输入是标准输入」
 * 1. 需要用到标准输入得, 不需要用到标准输入得
 * 2. 配置流程中的上下文的「流程引擎中识别」
 */
export const changeStateAction = (conf: UpdateStateOptions, baseActionInfo): ActionDoFn => {
  // 更新状态动作的配置和定义
  const { changeMapping } = conf;
  if (changeMapping) {
    return async (ctx: RunTimeCtxToBusiness) => {
      // const { action: { payload }, asyncDispatchOfIUBEngine } = ctx;
      // if (payload) {
      //   asyncDispatchOfIUBEngine({
      //     dispatch: {
      //       module: DispatchModuleName.IUBStore,
      //       method: DispatchMethodNameOfIUBStore.targetUpdateState,
      //       params: [ changeMapping.struct[0].key, payload]
      //     }
      //   });
      // }
      console.log(changeMapping);
      console.log(ctx);
    };
  }
  return async () => {
    console.log(changeMapping);
  };
};
