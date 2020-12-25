import { TransfromCtx } from "@src/page-data/types";
import { splitMark, runCtxPayloadMark, ref2ValMark, interMetaMark, ACT_MARK, REF2VAL_MARK, REQ_MARK, apiReqMark, flowMark } from "../IUBDSL-mark";
// eslint-disable-next-line import/no-cycle
import { changeStateAction, genDefalutFlow } from "../task";
import { FuncCodeOfAPB } from "../task/action-types-of-IUB";


/**
 * 改变XX对象的ref2Val模版
 * @param ref2ValId id
 * @param key 更改目标的key
 * @param valRef 额外引用的位置
 */
export const ref2ValTemplateOfChangeObj = (ref2ValId: string, key: string, valRef?: string) => ({
  ref2ValId,
  type: 'structObject',
  struct: [
    {
      val: runCtxPayloadMark + (valRef ? splitMark + valRef : ''), // 来源: 固定值, 表达式, 后端数据
      key, // 目标: 页面变量的标示位
    }
  ]
});

/**
 * 在payload上获取对应的值, 并设置给对应对象「IUBStore、....」
 * @param onlyMark 唯一标示
 * @param setTargetOrRef2Val 设置的目标
 */
export const genChangeProps = (onlyMark: string, setTargetOrRef2Val: string | Record<string, unknown>) => {
  /** 唯一ID */
  const actionId = ACT_MARK + onlyMark;
  const ref2ValId = REF2VAL_MARK + onlyMark;
  /** 3个必备元素 */
  let ref2Val;
  if (typeof setTargetOrRef2Val === 'string') {
    ref2Val = ref2ValTemplateOfChangeObj(ref2ValId, setTargetOrRef2Val);
  } else {
    ref2Val = Object.assign(setTargetOrRef2Val, { ref2ValId });
  }
  const action = changeStateAction(actionId, ref2ValMark + ref2ValId);
  const flow = genDefalutFlow(actionId);
  return {
    ref2Val, action, flow
  };
};

/**
 * 将genChangeProps 生成的 flow、action、ref2Val 储存到转换上下文
 * @param transfromCtx 转换上下文
 * @param onlyMark 唯一标示
 * @param setTargetOrRef2Val 设置的目标
 */
export const genChangePropsAndSetCtx = (transfromCtx: TransfromCtx, onlyMark: string, setTargetOrRef2Val: string | Record<string, unknown>) => {
  const { 
    extralDsl: { tempAction, tempFlow, tempRef2Val } 
  } = transfromCtx;
  const result = genChangeProps(onlyMark, setTargetOrRef2Val);
  const { flow, action, ref2Val } = result;
  tempRef2Val.push(ref2Val);
  tempAction.push(action);
  tempFlow.push(flow);
  return result;
};

/**
 * 
 * @param transfromCtx 转换上下文
 * @param pageMeta 能获取tableId、fieldId的页面元数据
 */
export const getFieldFromPagetMeta = (transfromCtx: TransfromCtx, pageMeta) => {
  const { extralDsl: { pageFieldsToUse } } = transfromCtx;
  /**
   * @param metaKey 获取field的key
   * @param schemaRef :
   */
  return (metaKey: string, schema, schemaRef: string) => {
    const meta = pageMeta[metaKey];
    if (meta) {
      const tableId = meta.tableInfo.id;
      const fieldId = meta.column.id;
      const field = interMetaMark + tableId + splitMark + fieldId;       

      pageFieldsToUse.push({ tableId , fieldId, schemaRef, schema });
      return field;
    }
    return null;
  };
};

export const genDefaultRead = ({ onlyMark, readList, readDef }, readAfterFlow = []) => {
  const apbItem = {
    funcCode: FuncCodeOfAPB.R,
    stepsId: onlyMark,
    readList,
    readDef
  };
  const APBDefOfIUB = {
    reqId: REQ_MARK + onlyMark,
    reqType: 'APBDSL',
    list: {
      [onlyMark]: apbItem
    },
    steps: [onlyMark]
  };
  const action = {
    actionId: ACT_MARK + onlyMark,
    /** 动作名字 */
    actionName: '数据请求',
    /** 动作的类型 */
    actionType: 'APIReq',
    /** 不同动作的配置 */
    actionOptions: {
      apiReqRef: apiReqMark + APBDefOfIUB.reqId,
    }
  };
  const flow = genDefalutFlow(ACT_MARK + onlyMark, readAfterFlow); // [flowMark + updStateFlow.id]

  return {
    APBDefOfIUB,
    action,
    flow
  };
};

export const genDefaultReadAndSetCtx = (transfromCtx: TransfromCtx, { onlyMark, readList, readDef }, readAfterFlow?) => {
  const { extralDsl: { tempFlow, tempAPIReq, tempAction } } = transfromCtx;
  const genRes = genDefaultRead({ onlyMark, readList, readDef }, readAfterFlow);
  const { APBDefOfIUB, action, flow } = genRes;
  tempAPIReq.push(APBDefOfIUB);
  tempAction.push(action);
  tempFlow.push(flow); 
  return genRes;
};


export const addPageLifecycleWrap = (transfromCtx: TransfromCtx) => {
  const { extralDsl: { pageLifecycle } } = transfromCtx;
  return (lifecycleType: string, runId: string) => {
    /** 添加页面onload事件 */
    if (Array.isArray(pageLifecycle[lifecycleType])) {
      pageLifecycle[lifecycleType].push(runId);
    } else {
      pageLifecycle[lifecycleType] = [runId];
    }
  };
};
