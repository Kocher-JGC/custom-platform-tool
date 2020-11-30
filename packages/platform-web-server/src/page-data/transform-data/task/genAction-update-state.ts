import { TransfromCtx } from "../types";

export const changeStateAction = (transfromCtx: TransfromCtx, widgetId: string, schemas) => ({
  actionId: widgetId,
  actionName: 'updateState',
  actionType: 'updateState',
  actionOptions: {
    changeTarget: schemas
  },
  actionOutput: 'undefined'
});