import { DEFALUT_FLOW_MARK } from "../task";
import { TransfromCtx } from "../types";

export const genFormButtonDefaltAction = (widgetId: string) => ({
  onClick: {
    type: 'actionRef',
    actionID: `@(flow).${DEFALUT_FLOW_MARK}${widgetId}`
  }
});

/** 生成按钮widget */
export const genFromButton = (transfromCtx: TransfromCtx, { id, widgetRef, propState }) => {
  const { title, type, actionRef } = propState;
  const { 
    extralDsl: { tempAction, tempFlow, tempBusinessCode }
  } = transfromCtx;
  tempBusinessCode.push(`__${id}`);
  return {
    id, widgetId: id, widgetRef: 'NormalButton', 
    title, label: title, text: title, type,
    actions: {
      ...genFormButtonDefaltAction(actionRef)
    }
  };
};