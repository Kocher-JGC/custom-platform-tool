import { UpdateStateOptions } from "@iub-dsl/definition/actions";
import { ActionDoFn } from "../types";
import { DispatchModuleName, DispatchMethodNameOfIUBStore } from "../../runtime/types";

/**
 * 最重要的问题: 流程和隔离
 * 单个action和多个action
 * 事件触发、标准输入「action输入是标准输入」
 * 1. 需要用到标准输入得, 不需要用到标准输入得
 * 2. 配置流程中的上下文的「流程引擎中识别」
 */
export const updateStateAction = (conf: UpdateStateOptions, baseActionInfo): ActionDoFn => {
  // 更新状态动作的配置和定义
  const {
    changeTarget,
    changeMapping
  } = conf;
  if (changeTarget) {
    return async ({ action, asyncDispatchOfIUBEngine }) => {
      // action, 标准得事件执行上下文, param2 运行时上下文标准函数
      return await asyncDispatchOfIUBEngine({
        dispatch: {
          module: DispatchModuleName.IUBStore,
          method: DispatchMethodNameOfIUBStore.targetUpdateState,
          params: [changeTarget, action.payload],
        },
        actionInfo: action,
      });
    };
  }
  if (changeMapping) {
    return async ({ action, asyncDispatchOfIUBEngine }) => {
      return await asyncDispatchOfIUBEngine({
        dispatch: {
          module: DispatchModuleName.IUBStore,
          method: DispatchMethodNameOfIUBStore.targetUpdateState,
          params: [changeMapping, action.payload],
        },
        actionInfo: action,
      });
    };
  }
  return async () => {
  };
};
