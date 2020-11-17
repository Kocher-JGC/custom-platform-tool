import { TransfromCtx } from "../types";

export const genOpenPageAction = (transfromCtx: TransfromCtx, actionId: string, actionConf) => {
  const { extralDsl } = transfromCtx;
  const { triggerAction, event, action: { pageID } } = actionConf;
  return {
    actionId,
    actionName: `openModal_${actionId}`,
    actionType: 'openModal',
    actionOptions: {
      type: 'iub-dsl',
      pageUrl: pageID,
      triggerAction,
      event
    },
    actionOutput: 'undefined'
  };
};