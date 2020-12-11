import { pickFlowMark } from '../IUBDSL-mark';
import { FlowCollection, FlowItemInfo } from "@iub-dsl/definition";
import { RunTimeCtxToBusiness } from '../runtime/types';
import { noopError, reSetFuncWrap } from '../utils';
import { flowOutRunWrap, flowItemRunWrap, onceFlowOutRunWrap } from './flow-run';

/**
 * 流程集合描述的解析器
 * @param flows 流程集合的描述
 * @think 解析上下文的信息 「如何传递和处理」? answer: 可以通过分开函数/合并函数解决
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
     * 1. 若绑定时候解析, 则调用的是未解析完整的「需要支持, 运行:解析并运行」
     * 2. 目前: 在一个地方, 统一额外解析
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

  const reSetFlow = reSetFuncWrap(flowIds, flowItemList);
  
  
  return {
    flowIds,
    flowItemList,
    reSetFlow,
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
  
  /**
   * 方式一: flowOut的额外解析和flowItem的额外解析, 统一传入
   * @description flow的额外解析器
   */
  return (flowExtralParser) => {
    const { 
      actionRunFn, condRunFn,
      flowOutFns, flowOutCondFns,
    } = flowExtralParser(flowItem);

    const flowOutRunFn = flowOutRunWrap({ flowOutFns, flowOutCondFns });

    const flowItemRunFn = flowItemRunWrap({
      actionRunFn, condRunFn, flowOutRunFn
    });

    return flowItemRunFn;
  };
};
