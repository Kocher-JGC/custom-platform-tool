import { FlowItemInfo } from '@iub-dsl/definition';
import { noopTrueFn } from "../../utils";

export const flowExtraParser = (parseRes) => {
  const { 
    actionParseRes,
    flowParseRes,
  } = parseRes;

  const { bindAction } = actionParseRes;
  const { reSetFlow, bindFlows } = flowParseRes;

  const extraParser = (conf: FlowItemInfo) => {
    const {  actionId, flowOutCondition, flowOut, condition } = conf;
    /** 解析和绑定 */
    const actionRunFn = bindAction(actionId);
    const flowOutFns = flowOut.map(bindFlows);
    const condRunFn = noopTrueFn;
    const flowOutCondFns = flowOutCondition.map(() => noopTrueFn);

    return  { 
      actionRunFn, condRunFn,
      flowOutFns, flowOutCondFns,
    };
  };  

  /** 所有flow的额外的解析 */
  reSetFlow((flowFnWrap) => flowFnWrap(extraParser));
};
