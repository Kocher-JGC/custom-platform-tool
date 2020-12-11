import { genEmptyActionFLows } from "./task";
import { TransfromCtx } from "../types";
import { flowMark, FLOW_MARK } from "./IUBDSL-mark";

export const event2Flows = (transfromCtx: TransfromCtx, events: { [str:string]: { actList: string[] } }) => {
  const { extralDsl: { tempFlow } } = transfromCtx;
  // const eventIds = Object.keys()
  for (const eventId in events) {
    const ev = events[eventId];
    tempFlow.push(genEmptyActionFLows(eventId, ev.actList.map(key => flowMark + FLOW_MARK + key)));
  }
  
};
