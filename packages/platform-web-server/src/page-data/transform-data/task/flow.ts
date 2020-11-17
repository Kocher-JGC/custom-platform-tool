export const DEFALUT_FLOW_MARK = 'f_';


export const genDefalutFlow = (id: string, out = []) => ({
  id: `${DEFALUT_FLOW_MARK}${id}`,
  actionId: `@(actions).${id}`,
  flowOutCondition: [],
  flowOut: [out]
});