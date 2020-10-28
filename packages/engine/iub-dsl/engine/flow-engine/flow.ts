/** TODO: 流程上下文运行不是特别规范 */

import { FlowCollection, FlowItemInfo, FlowOutItemWires } from '@iub-dsl/definition/flow';
import { Condition, CommonCondition } from "@iub-dsl/definition";

const isPromise = (fn) => typeof fn?.then === 'function' || fn instanceof Promise;

export interface FlowItemParseRes {
  flowItemRun: any; // fn
  changeStateToUse: string[]
  getStateToUse: string[]
}
interface FlowItemListParseRes {
  [flowId: string]: FlowItemParseRes
}

interface FlowParseRes {
  flowIds: string[];
  flowItemListParseRes: FlowItemListParseRes;
  getFlowItemInfo: GetFlowItemInfo;
  flowsRun: any;
}

interface FlowRunOptions {
  getFlowItemInfo: GetFlowItemInfo

}

export interface GetFlowItemInfo {
  (flowId: string): FlowItemParseRes
}

/**
 * 流程集合描述的解析器
 * @param flows 流程集合的描述
 * @param param1 TODO: 解析上下文的信息 「如何传递和处理」
 */
export const flowParser = (flows: FlowCollection, { parseContext, parseRes }): FlowParseRes => {
  const flowIds = Object.keys(flows);

  let flowId: string;
  /** 解析结果 */
  const flowItemListParseRes: FlowItemListParseRes = {};
  /** 临时存放结果: 用于后续锁定上下文 */
  const tempArr: any[] = [];
  for (let i = 0; i < flowIds.length; i++) {
    flowId = flowIds[i];
    /** TODO: 一个流程所用到的所有依赖分析 */
    const flowItemParseRes = flowItemParser(flows[flowId], { parseRes, parseContext });
    tempArr.push(flowItemParseRes);
    flowItemListParseRes[flowId] = flowItemParseRes;
  }

  const getFlowItemInfo = getFlowItemInfoFnWrap(flowItemListParseRes, flowIds);

  /** 流程控制模块运行必要的上下文选择 */
  const flowRunOptions = { getFlowItemInfo };
  /** 监控流程的想法测试 */
  // const aop = (handle) => {
  //   return async (...args) => {
  //     console.log(args[0].action);
  //     const res = await handle(...args);

  //     return res;
  //   };
  // };
  tempArr.forEach((temp) => {
    temp.flowItemRun = temp.flowItemRun(flowRunOptions);
    // temp.flowItemRun = aop(temp.flowItemRun);
  });
  tempArr.length = 0;

  const flowsRun = (ctx, runFlowIds: string[]) => {
    runFlowIds.forEach((id) => {
      if (flowIds.includes(id)) {
        const { flowItemRun } = getFlowItemInfo(id);
        const contextToUse = {
          ...ctx
        };
        // 触发标准的事件, 传入上下文, 需要create不然第一次动作将丢失
        flowItemRun(Object.create(contextToUse));
      } else {
        console.error('触发不存在的流程!');
      }
    });
  };

  return {
    flowIds,
    flowItemListParseRes,
    getFlowItemInfo,
    flowsRun
  };
};

const getFlowItemInfoFnWrap = (resolvedOfFlow: FlowItemListParseRes, flowIds: string[]): GetFlowItemInfo => {
  return (flowId) => {
    flowId = flowId.replace(/@\(flow\)\./, '');
    if (flowIds.includes(flowId)) {
      return resolvedOfFlow[flowId];
    }
    console.error('获取流程失败!');
    return {
      flowItemRun: () => {},
      changeStateToUse: [],
      getStateToUse: []
    };
  };
};

interface OnceFlowOutRunWrap {
  (flowIds: FlowOutItemWires): OnceFlowOutRun
}

interface OnceFlowOutRun<C = any> {
  (flowRunOptions: FlowRunOptions, context?: C): Promise<any>
}

/**
 *「出口以及出口的线的运行不阻塞, 但是往下走是阻塞的」
 * 注意: 区分是否需要阻塞
 * 流程一个出口所有线的运行
 * @param flowIds 流程Ids
 * @param param1 上下文
 */
const onceFlowOutRunWrap: OnceFlowOutRunWrap = (flowIds: FlowOutItemWires) => {
  return async ({ getFlowItemInfo }: FlowRunOptions, context = {}) => {
    /** 同一个出口出去的所有线上下文应该是同一个 TODO: 现在处理还不完善 */
    const newFlowCtx = Object.create(context);
    /** 一个出口所有线运行的结果 */
    const onceFlowOutRunRes = await onceFlowOutRun(newFlowCtx, { flowIds, getFlowItemInfo });

    /** TODO: 处理结果 */
    /** 返回原本的对象 */
    return Object.getPrototypeOf(newFlowCtx);
  };
};

/**
 * 一个流程出口所有线的运行. 全都promise化
 * @param flowCtx 流程上下文
 * @param param1 上下文
 */
const onceFlowOutRun = async (flowCtx, { flowIds, getFlowItemInfo }: { flowIds: FlowOutItemWires, getFlowItemInfo: GetFlowItemInfo }) => {
  /** 不阻塞 */
  const onceFlowOutRunRes = flowIds.map((flowId, index) => {
    const flowItemRunInfo = getFlowItemInfo(flowId);
    const { flowItemRun } = flowItemRunInfo;
    const flowItemRunRes = flowItemRun(flowCtx);

    if (!isPromise(flowItemRunRes)) {
      return Promise.resolve(flowItemRunRes);
    }
    return flowItemRunRes;
  });

  return await Promise.all(onceFlowOutRunRes);
};

/** 预留: 阻塞的运行 */
const onceFlowOutBlockRun = async (flowIds: string[], runtimeCtx = {}, { getFlowItemInfo }) => {
  const flowId = flowIds.pop();
  if (flowId) {
    const { flowFn } = getFlowItemInfo(flowId);
    const res = flowFn(runtimeCtx, { getFlowItemInfo });
    if (isPromise(res)) {
      return await res;
    }
    return res;
  }
  return false;
};

/** 单项流程运行函数生成的参数 */
interface FlowItemRunWrapParam<C = any> extends CommonCondition {
  /** TODO: 实际动作运行的interface如何写? */
  actionHandle: (ctx: C, ...args) => unknown;
  flowOutRun: OnceFlowOutRun<C>
}

/**
 * 流程单项动作的运行函数生成器
 * @param FlowItemRunWrapParam
 * @return Fn 单项流程运行的实际函数
 */
const flowItemRunWrap = ({
  actionHandle, flowOutRun: actualFlowOutRun,
  /** 控制当前项流程是否可以运行 */
  when, condition
}: FlowItemRunWrapParam) => {
  return (flowRunOptions: FlowRunOptions) => { // flowRunOptions
    return async (context = {}) => {
      let newCtx = context;
      let actionRunRes: any = actionHandle(context);
      /** TODO: context和动作结果的处理 */
      if (isPromise(actionRunRes)) {
        actionRunRes = await actionRunRes || {};
        newCtx = mergeActionRunRes(context, actionRunRes);
        await actualFlowOutRun?.(flowRunOptions, newCtx);
      } else {
        newCtx = mergeActionRunRes(context, actionRunRes);
        /** 当前项流程运行完, 运行出口 */
        await actualFlowOutRun?.(flowRunOptions, newCtx);
      }

      return newCtx;
    };
  };
};

/** 记得需要保持原型链一致 */
const mergeActionRunRes = (originContext, actionRes) => {
  return Object.assign(originContext, actionRes || {});
};

/**
 * 条件成了才能运行某个出口 {多个出口的运行也应该是非阻塞的}
 * 生成流程每项流程运行的出口运行函数
 * @param flowOut: FlowOutItemWires、
 */
const flowOutRunWrap = (
  { flowOut, flowOutCondition }: { flowOut: FlowOutItemWires[], flowOutCondition: CommonCondition[]}
) => {
  const flowOutNum = flowOut?.length || 0;
  const flowOutFns: OnceFlowOutRun[] = [];

  // TODO:
  for (let i = 0; i < flowOutNum; i++) {
    const flowIds = flowOut[i];
    flowOutFns.push(onceFlowOutRunWrap(flowIds));
  }
  return async (flowRunOptions: FlowRunOptions, context = {}) => {
    return await Promise.all(flowOutFns.map((fn) => fn(flowRunOptions, context)));
  };
};

/**
 * 1. 动作运行容器
 * 2. 流程通道运行 (二维数组)
 * 3. 每项流程运行控制
 * @description 每项流程的解析器
 * @param FlowItemInfo 一项的流程信息
 * @param context 解析上下文选项
 * @returns FlowItemParseRes
 */
const flowItemParser = (flowItem: FlowItemInfo, { parseContext, parseRes }): FlowItemParseRes => {
  const {
    id, flowOut, flowOutCondition, actionId, when, condition
  } = flowItem;
  /** TODO: 待修改 */
  const { actionParseRes: { getActionParseRes } } = parseRes;
  const { flowToUseCollect } = parseContext;
  const actionInfo = getActionParseRes(actionId);
  const { actionHandle, changeStateToUse, getStateToUse } = actionInfo;

  flowToUseCollect({ flowId: id, actionId });

  const flowOutRun = flowOutRunWrap({ flowOutCondition, flowOut });
  const flowItemRun = flowItemRunWrap({
    actionHandle, flowOutRun, when, condition
  });
  return {
    flowItemRun,
    changeStateToUse,
    getStateToUse
  };
};
