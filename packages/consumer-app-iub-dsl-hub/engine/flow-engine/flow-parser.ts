import { pickFlowMark } from '../IUBDSL-mark';
import { FlowCollection, FlowItemInfo } from "@iub-dsl/definition";
import { RunTimeCtxToBusiness } from '../runtime/types';
import { noopError } from '../utils';
/** 
 * Promise
 * all: 所有resolve时返回, 或者有一个reject --> catch
 * race: 返回最快有处理结果的「reject/resolve」(N个请求, 仅有一个返回)
 * allSettled: 所有promise处理完成时返回, 不管成功还是失败都返回「then」 
 */

const isPromise = (fn) => typeof fn?.then === 'function' || fn instanceof Promise;

/**
 * 流程集合描述的解析器
 * @param flows 流程集合的描述
 * @param param1 TODO: 解析上下文的信息 「如何传递和处理」
 */
export const flowParser = (flows: FlowCollection) => {
  const flowIds = Object.keys(flows);

  let flowId: string;
  /** 解析结果 */
  const flowItemList = {};
  for (let i = 0; i < flowIds.length; i++) {
    flowId = flowIds[i];
    const flowItemParseRes = flowItemParser(flows[flowId]);
    flowItemList[flowId] = flowItemParseRes;
  }

  /**
   * 绑定单个流程项的函数
   * @param flowId 流程项id
   */
  const bindFlow = (flowId: string) => {
    /** 预留: 非FlowId, 绑定时候可以做额外的判断或处理 */
    flowId = pickFlowMark(flowId);
    /**
     * 最后一层包装函数
     * 优化: 惰性函数储存
     */
    const flowFn = (context: RunTimeCtxToBusiness) => {
      /** 外部会对运行函数进行修改, 惰性赋值 */
      let flowItemRunFn = flowItemList[flowId];

      if (typeof flowItemRunFn !== 'function') {
        console.error(`获取流程失败!: ${flowId}`);
        flowItemRunFn = noopError;
      }

      return flowItemRunFn(context);
    };
    return flowFn;
  };

  /**
   * 绑定多个流程项的函数
   * 1. 每项流程的运行应该是独立而且相互不影响的
   * 2. 结果返回的选项「等待所有执行完成, 最快运行的流程项, 指定某个流程项」
   * @param flowIds 流程项ids
   */
  const bindFlows = (flowIds: string[]) => {
    const flowFn = (context: RunTimeCtxToBusiness) => {
      const flowRunFns = flowIds.map(bindFlow);

      /** 等价于一个出口所有线的运行 Promise.all */
      return onceFlowOutRunWrap(flowRunFns)(context); /** 惰性储存 */
    };
    return flowFn;
  };
  

  return {
    flowIds,
    flowItemList,
    bindFlows,
    bindFlow
  };
};

/**
 * 最终的函数是,每项流程运行的完整函数
 * @param flowItem 每项流程配置
 */
const flowItemParser = (flowItem: FlowItemInfo) => {
  
  /** 确保数据准确性 */
  if (!Array.isArray(flowItem.flowOut)) flowItem.flowOut = [];
  if (!Array.isArray(flowItem.flowOutCondition)) flowItem.flowOutCondition = [];
  
  return (extralFlowParse) => {
    const { 
      actionRunFn, condRunFn,
      flowOutFns, flowOutCondFns,
    } = extralFlowParse(flowItem);

    const flowOutRunFn = flowOutRunWrap({ flowOutFns, flowOutCondFns });

    const flowItemRunFn = flowItemRunWrap({
      actionRunFn, condRunFn, flowOutRunFn
    });

    return flowItemRunFn;
  };
};

/**
 * 返回流程出口运行的函数的包装函数
 * 条件成了才能运行某个出口 {多个出口的运行也应该是非阻塞的}
 * 生成流程每项流程运行的出口运行函数
 * @param flowOutFns: FlowOutItemWires {所有出口运行的函数}
 */
const flowOutRunWrap = (
  { flowOutFns = [], flowOutCondFns = [] }
) => {
  const flowOutNum = flowOutFns.length;

  return async (context) => {

    /** 条件过滤流程出口的处理 */
    const runflowOutFns: any[] = [];
    const filterFlowOut = async (cond: any[], idx: number) => {
      const onceCondFn = cond[idx];
      if (await onceCondFn(context)) {
        runflowOutFns.push(flowOutFns[idx]);
      }
      if (idx < flowOutNum - 1) {
        await filterFlowOut(cond, idx + 1);
      }
    };

    if (flowOutFns.length) {
      await filterFlowOut(flowOutCondFns, 0);
    }
    
    /** 条件过滤流程出口的处理 */
    return await Promise.all(runflowOutFns.map((fn) => fn(context)));
  };
};

/**
 * 一个流程出口所有线的运行. 全都promise化「一个出口运行的函数」
 * @param flowCtx 流程上下文
 * @param param1 上下文
 */
const onceFlowOutRunWrap = (flowFns) => {
  return async (flowCtx) => {
    /** 不阻塞 */
    const onceFlowOutRunRes = flowFns.map((fns, index) => {
      const flowItemRunRes = fns(flowCtx);
        
      if (!isPromise(flowItemRunRes)) {
        return Promise.resolve(flowItemRunRes);
      }
      return flowItemRunRes;
    });
    
    /** TODO: 是否应该使用allSettled */
    return await Promise.all(onceFlowOutRunRes);
  };
};

/**
 * 流程单项动作的运行函数生成器 {包装函数}
 * @param FlowItemRunWrapParam
 * @return Fn 单项流程运行的实际函数
 */
const flowItemRunWrap = ({
  actionRunFn, condRunFn, flowOutRunFn,
}) => {
  return async (context = {}) => {
    let newCtx = context;
    if (await condRunFn(context)) {
      let actionRunRes: any = actionRunFn(context);
      /** TODO: context与动作的运行结果的合并处理 */
      if (isPromise(actionRunRes)) {
        actionRunRes = await actionRunRes || {};
      }
      newCtx = mergeActionRunRes(context, actionRunRes);
      /** 当前项流程运行完, 运行出口 */
      await flowOutRunFn?.(newCtx);
    }
    return newCtx;
  };
};

/** 记得需要保持原型链一致 */
const mergeActionRunRes = (originContext, actionRes) => {
  return Object.assign(originContext, actionRes || {});
};
