/**
 * 返回流程出口运行的函数的包装函数
 * 条件成了才能运行某个出口 {多个出口的运行也应该是非阻塞的}
 * 生成流程每项流程运行的出口运行函数
 * @param flowOutFns: FlowOutItemWires {所有出口运行的函数}
 */
export const flowOutRunWrap = (
  { flowOutFns = [], flowOutCondFns = [] }
) => {
  const flowOutNum = flowOutFns.length;

  return async (context) => {

    /** 条件过滤流程出口的处理 */
    const runflowOutFns: any[] = [];
    const filterFlowOut = async (cond: any[], idx: number) => {
      // const onceCondFn = cond[idx];
      // if (await onceCondFn(context)) {
      runflowOutFns.push(flowOutFns[idx]);
      // }
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
export const onceFlowOutRunWrap = (flowFns) => {
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
export const flowItemRunWrap = ({
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

/*_____________ Utils ______________ */

/** 
 * Promise
 * all: 所有resolve时返回, 或者有一个reject --> catch
 * race: 返回最快有处理结果的「reject/resolve」(N个请求, 仅有一个返回)
 * allSettled: 所有promise处理完成时返回, 不管成功还是失败都返回「then」 
 */

const isPromise = (fn) => typeof fn?.then === 'function' || fn instanceof Promise;


/** 记得需要保持原型链一致 */
const mergeActionRunRes = (originContext, actionRes) => {
  return Object.assign(originContext, actionRes || {});
};
