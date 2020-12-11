import { TransfromCtx } from "../../types/types";

export const changeStateAction = (transfromCtx: TransfromCtx, widgetId: string, idOfref2Val) => ({
  actionId: widgetId,
  actionName: 'changeState',
  actionType: 'changeState',
  actionOptions: { changeMapping: idOfref2Val },
  actionOutput: 'undefined'
});