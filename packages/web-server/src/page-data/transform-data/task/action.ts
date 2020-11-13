import { genAPBDSLAction, genOpenPageAction, genDefalutFlow } from ".";
import { TransfromCtx } from "../types";

export const genAction = (transfromCtx: TransfromCtx, actions, { pageSchema })  => {
  const { extralDsl: { tempFlow } } = transfromCtx;
  let res = {};
  const actionIds = Object.keys(actions);
  actionIds.forEach(id => {
    const action = actions[id][0];
    if (action) {
      const { triggerAction, event, action: { pageID } } = action;
      if (triggerAction === 'submit' && event === 'onClick') {
        res = {
          ...res,
          ...genAPBDSLAction(transfromCtx, id, action, pageSchema)
        };
      }
      if (triggerAction === 'openPage' && pageID) {
        res[id] = genOpenPageAction(transfromCtx, id, action);
        tempFlow.push(genDefalutFlow(id));
        transfromCtx.extralDsl.tempOpenPageUrl = pageID; /** 临时的url */
      }
    } else {
      console.error('获取action失败');
    }
  });

  return res;
};