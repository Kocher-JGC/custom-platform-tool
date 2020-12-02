import { DEFALUT_FLOW_MARK } from "../task";
import { TransfromCtx } from "../../types/types";

export const genFormButtonDefaltAction = (widgetId: string) => ({
  onClick: {
    type: 'actionRef',
    actionID: `@(flow).${DEFALUT_FLOW_MARK}${widgetId}`
  }
});

/** 生成按钮widget */
export const genFromButton = (transfromCtx: TransfromCtx, { id, widgetRef, propState }) => {
  const { title, type, actionRef, widgetCode } = propState;
  const { 
    extralDsl: { tempAction, tempFlow, tempBusinessCode }
  } = transfromCtx;
  tempBusinessCode.push(`__${id}`);
  return {
    widgetId: id, widgetRef, propState, widgetCode,
    eventHandlers: {
      ...genFormButtonDefaltAction(actionRef)
    },
  };
};