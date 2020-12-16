import { TransfromCtx } from "@src/page-data/types";
import { splitMark, runCtxPayloadMark, ref2ValMark, interMetaMark, ACT_MARK, REF2VAL_MARK } from "../IUBDSL-mark";
import { changeStateAction, genDefalutFlow } from "../task";


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
 * @param setTarget 设置的目标
 * @param valRef 值获取的额外引用
 */
export const genChangeProps = (onlyMark: string, setTarget: string, valRef?: string) => {
  /** 唯一ID */
  const actionId = ACT_MARK + onlyMark;
  const ref2ValId = REF2VAL_MARK + onlyMark;
  /** 3个必备元素 */
  const ref2Val = ref2ValTemplateOfChangeObj(ref2ValId, setTarget, valRef);
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
 * @param setTarget 设置的目标
 * @param valRef 值获取的额外引用
 */
export const genChangePropsAndSetCtx = (transfromCtx: TransfromCtx, onlyMark: string, setTarget: string, valRef?: string) => {
  const { 
    extralDsl: { tempAction, tempFlow, tempRef2Val } 
  } = transfromCtx;
  const result = genChangeProps(onlyMark, setTarget, valRef);
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
  return (metaKey: string, schemaRef: string) => {
    const meta = pageMeta[metaKey];
    if (meta) {
      const tableId = meta.tableInfo.id;
      const fieldId = meta.column.id;
      const field = interMetaMark + tableId + splitMark + fieldId;       

      pageFieldsToUse.push({ tableId , fieldId, schemaRef });
      return field;
    }
    return null;
  };
};