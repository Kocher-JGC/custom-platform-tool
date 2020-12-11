import { TransfromCtx } from "../../types/types";
import { defaultGenEvents } from "./default-gen";


const genFormButtonEvents = defaultGenEvents;

/** 生成按钮widget */
export const genFromButton = (transfromCtx: TransfromCtx, { id, widgetRef, propState }) => {
  const { title, type, eventRef, widgetCode } = propState;
  const { 
    extralDsl: { tempAction, tempFlow, tempBusinessCode }
  } = transfromCtx;
  tempBusinessCode.push(`__${id}`);
  return {
    widgetId: id, widgetRef, propState, widgetCode,
    eventHandlers: {
      ...genFormButtonEvents(eventRef)
    },
  };
};