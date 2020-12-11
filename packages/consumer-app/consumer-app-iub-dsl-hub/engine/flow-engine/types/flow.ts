import { FlowOutItemWires } from "@iub-dsl/definition/flow";

export interface FlowItemParseRes {
  flowItemRun: any; // fn
  changeStateToUse: string[]
  getStateToUse: string[]
}
export interface FlowItemListParseRes {
  [flowId: string]: FlowItemParseRes
}

export interface FlowParseRes {
  flowIds: string[];
  flowItemListParseRes: FlowItemListParseRes;
  getFlowItemInfo: GetFlowItemInfo;
  flowsRun: any;
}

export interface FlowRunOptions {
  getFlowItemInfo: GetFlowItemInfo

}

export interface GetFlowItemInfo {
  (flowId: string): FlowItemParseRes
}

export interface OnceFlowOutRunWrap {
  (flowIds: FlowOutItemWires): OnceFlowOutRun
}

export interface OnceFlowOutRun<C = any> {
  (flowRunOptions: FlowRunOptions, context?: C): Promise<any>
}

/** 预留: 阻塞的运行 */
// const onceFlowOutBlockRun = async (flowIds: string[], runtimeCtx = {}, { getFlowItemInfo }) => {
//   const flowId = flowIds.pop();
//   if (flowId) {
//     const { flowFn } = getFlowItemInfo(flowId);
//     const res = flowFn(runtimeCtx, { getFlowItemInfo });
//     if (isPromise(res)) {
//       return await res;
//     }
//     return res;
//   }
//   return false;
// };
