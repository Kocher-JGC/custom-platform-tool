import { actionMark, FLOW_MARK } from "../IUBDSL-mark";


export const genDefalutFlow = (id: string, out = []) => ({
  id: `${FLOW_MARK}${id}`,
  actionId: `${actionMark + id}`,
  flowOutCondition: [],
  flowOut: [out]
});

export const genEmptyActionFLows = (id, out: string[] = []) => ({
  id,
  actionId: '',
  flowOutCondition: [],
  flowOut: [out]
});
