import { FlowItemInfo } from '@iub-dsl/definition';
import { noopTrueFn } from "../../utils";
import { RunTimeCtxToBusiness } from '../../runtime/types';

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
    const condRunFn = condition ? (IUBCtx) => {
      const { pageStatus } = IUBCtx;
      return condition === 'update_get' ? pageStatus === 'update' : true;
    } : noopTrueFn;
    
    const flowOutCondFns = flowOutCondition.map((str, idx) => {
      if (str !== undefined) {
        return (IUBCtx: RunTimeCtxToBusiness) => {
          const { pageStatus } = IUBCtx;
          if (str === 'update_get') {
            // console.log(pageStatus);
            // return pageStatus === 'update'
          }
          if (pageStatus === 'update') {
            return str === 'update';
          } 
          return idx !== 1;
          
        };
      }
      return noopTrueFn;
    });

    return  { 
      actionRunFn, condRunFn,
      flowOutFns, flowOutCondFns,
    };
  };  

  /** 所有flow的额外的解析 */
  reSetFlow((flowFnWrap) => flowFnWrap(extraParser));
};
