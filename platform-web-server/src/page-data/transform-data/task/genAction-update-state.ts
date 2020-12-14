import { TransfromCtx } from "../../types/types";
import { runCtxPayloadMark } from "../IUBDSL-mark";

export const changeStateAction = (actionId: string, idOfref2Val) => ({
  actionId,
  actionName: 'changeState',
  actionType: 'changeState',
  actionOptions: { changeMapping: idOfref2Val },
  actionOutput: 'undefined'
});

export const payloadRef2ValTemplate = (ref2ValId: string, key: string) => ({
  ref2ValId,
  type: 'structObject',
  struct: [
    {
      val: runCtxPayloadMark, // 来源: 固定值, 表达式, 后端数据
      key, // 目标: 页面变量的标示位
    }
  ]
});