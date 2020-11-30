import { ConditionCollection, Condition } from '@iub-dsl/definition';
import { RunTimeCtxToBusiness } from '../../runtime/types';
import { ConditionEngineCtx } from '../../condition-engine/types';
import { getPageCondOperatorHandle, pageCondControlResHandle } from '../../condition-engine/page-condition';
import { normalParamOfCondList, condControlRun } from '../../condition-engine/utils';

const condItemHandleWrap = (condItem) => {
  if (!condItem || !condItem.operator) {
    console.error(`错误的条件项配置!!${JSON.stringify(condItem)}`);
    return async (ctx) => {
      console.error(`错误的条件项配置!!${JSON.stringify(condItem)}`);
      return false;
    };
  }
  return async (ctx) => {
    const { getOperatorHandle, expsValueHandle } = ctx;
    const { operator, expsValue } = condItem;
    /** 实际处理 函数 */
    const operatorHandle = getOperatorHandle(operator);
    /** 处理传入值 */
    const actualExpsValue = await expsValueHandle(expsValue);
    /** 实际处理 */
    return await operatorHandle({ operator, expsValue: actualExpsValue });
  }; 
};

/**
 * 条件处理引擎
 * 扩展: 同步
 * 扩展: 分开2种实现, 1、先list后运行  2、边运行边计算
 * @param conf 需要处理的条件信息
 * @param param1 条件引擎需要使用的参数
 */
export const condParser = async (
  conf: Condition,
) => {
  const { conditionControl, conditionList } = conf;
  /** 解析 */
  const normalCondListParam = normalParamOfCondList(conditionList);
  
  return async (
    ctx: RunTimeCtxToBusiness,
    {
      expsValueHandle,
      getOperatorHandle = getPageCondOperatorHandle,
      condControlResHandle = pageCondControlResHandle,
    }: ConditionEngineCtx
  ) => {
    /** 绑定默认上下文 */
    getOperatorHandle = getOperatorHandle.bind(null, ctx);
    
    const getCondItem = (condId: string) => normalCondListParam[condId];
  
    /** 扩展问题 ?? */
    const condItemHandle = async (condId: string) => {
      const condItem = getCondItem(condId);
      /** TODO: 断言 */
      if (!condItem) return false;
  
      const { operator, expsValue } = condItem;
      /** 实际处理 函数 */
      const operatorHandle = getOperatorHandle(operator);
      /** 处理传入值 */
      const actualExpsValue = await expsValueHandle(expsValue);
      /** 实际处理 */
      return await operatorHandle({ operator, expsValue: actualExpsValue });
    };
  
    return condControlResHandle(
      await condControlRun(conditionControl, {
        condItemHandle,
        condControlResHandle
      })
    );
  };

};


export const conditionParser = (condC: ConditionCollection) => {

  const condCKeys  = Object.keys(condC);
  
  const condCParseRes = {};

  condCKeys.forEach((condId) => {
    console.log(condC[condId]);
    const condConf = condC[condId]?.condition;
    if (condConf) {
      // condition
      condCParseRes[condId] = condParser(condConf);
    }
    
  });
  
  const bindCondition = (condRefId: string) => {
    return condCParseRes[condRefId]; 
  };

  return {
    bindCondition,
    condCParseRes,
    condCKeys
  };
};
