import {
  ConditionOperator, ConditionItemInfo, ConditionDescriptionInfo, Condition,
  ConditionList,
  ConditionControl
} from "@iub-dsl/definition";
import { RunTimeCtxToBusiness } from "../runtime/types/dispatch-types";
import { condControlRun, normalParamOfCondList } from "./utils";
import { getPageCondOperatorHandle, pageCondControlResHandle } from "./page-condition";
import { ConditionEngineCtx } from "./types";

const conditionExample: Condition = {
  conditionList: {
    condId0: {
      operator: ConditionOperator.EMPTY,
      exp1: '3'
    },
    condId1: {
      operator: ConditionOperator.N_EMPTY,
      exp1: '@(schema).entity_25'
    },
    condId2: {
      operator: ConditionOperator.EQU,
      exp1: '@(schema).entity_26',
      exp2: '@(schema).entity_27'
    }
  },
  conditionControl: {
    and: ['condId2', 'condId1', {
      and: ['condId1'],
      or: ['condId2']
    }],
    or: ['condId0']
  }
};

/**
 * 条件处理引擎
 * @param conf 需要处理的条件信息
 * @param param1 条件引擎需要使用的参数
 */
export const conditionEngine = async (
  ctx: RunTimeCtxToBusiness,
  conf: Condition = conditionExample,
  {
    expsValueHandle,
    getOperatorHandle = getPageCondOperatorHandle,
    condControlResHandle = pageCondControlResHandle,
  }: ConditionEngineCtx
) => {
  /** 绑定默认上下文 */
  getOperatorHandle = getOperatorHandle.bind(null, ctx);

  const { conditionControl, conditionList } = conf;

  /** 解析 */
  const normalCondListParam = normalParamOfCondList(conditionList);

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
