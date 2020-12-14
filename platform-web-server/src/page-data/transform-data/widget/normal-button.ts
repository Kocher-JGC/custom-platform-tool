import { TransfromCtx } from "../../types/types";
import { defaultGenEvents } from "./default-gen";
import { ACT_MARK, FLOW_MARK, REQ_MARK, apiReqMark, flowMark } from "../IUBDSL-mark";
import { FuncCodeOfAPB } from "../task/action-types-of-IUB";
import { genDefalutFlow } from "../task";


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

/**
 * event\flow\action\req
 */

export const genDefaultTableDelBtn = (transfromCtx: TransfromCtx, { table, condition })=> {
  const widgetId = 'defaultDelTableBtn';
  const actionId = widgetId;
  const flowId = FLOW_MARK + widgetId;
  const reqId = REQ_MARK + widgetId;

  const { extralDsl: { tempFlow, tempAction, tempAPIReq } } = transfromCtx;

  const defaultDelBtn = {
    widgetId,
    widgetRef: "FormButton",
    propState: {
      title: "删除",
      field: null,
      eventRef: {
      }
    },
    eventHandlers: {
      onClick: {
        type: "flowEventHandler",
        flowItemIds: [
          `${flowMark}${flowId}`
        ]
      }
    }
  };
  const APBReq = {
    reqId,
    reqType: 'APBDSL',
    list: {
      'delRow': {
        stepsId: 'delRow',
        table,
        condition,
        funcCode: FuncCodeOfAPB.D
      }
    },
    steps: ['delRow']
  };
  const action = {
    actionId,
    actionName: `删除单行数据`,
    actionType: 'APIReq',
    actionOptions: {
      apiReqRef: apiReqMark + APBReq.reqId,
    }
  };
   
  tempFlow.push(genDefalutFlow(widgetId));
  tempAction.push(action);
  tempAPIReq.push(APBReq);
  return defaultDelBtn;
};