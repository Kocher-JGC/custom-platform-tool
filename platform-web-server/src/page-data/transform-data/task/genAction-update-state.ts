import { TransfromCtx } from "../../types/types";
import { runCtxPayloadMark, splitMark } from "../IUBDSL-mark";

export const changeStateAction = (actionId: string, idOfref2Val) => ({
  actionId,
  actionName: 'changeState',
  actionType: 'changeState',
  actionOptions: { changeMapping: idOfref2Val },
  actionOutput: 'undefined'
});
