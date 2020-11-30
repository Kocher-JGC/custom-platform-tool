import { TransfromCtx } from "../types";

export const defaultGen = (transfromCtx: TransfromCtx, { id, widgetRef, propState }) => {
  const { widgetCode } = propState;
  const { 
    extralDsl: { tempAction, tempFlow, tempSchema }
  } = transfromCtx;

  return {
    widgetId: id, widgetRef, propState, widgetCode
  };
};