export const isIUBDSLMark = (str: string) => /^@\([^\\)]+\)\./.test(str);

export const defaultPickMark = (str: string) => {
  const idx = str.indexOf(').') + 2;
  return [str.slice(0, idx), str.slice(idx)];
};

export const splitMark = '/';

export const ACT_MARK = 'act_';
export const REQ_MARK = 'req_';
export const FLOW_MARK = 'f_';
export const REF2VAL_MARK = 'ref2_';


/** 
 * 接口元数据的mark部分
 */
export const interMetaMark = '@(interMeta).';

/** 
 * 页面数据的mark
 */
export const schemaMark = '@(schema).';

/** 
 * 运行时上下文
 */
export const runCtxMark = '@(runCtx).';
export const runCtxPayloadMark = `${runCtxMark}payload`;

/** 
 * 动作的mark
 */
export const actionMark = '@(action).';

/** 
 * 流程配置的mark
 */
export const flowMark = '@(flow).';


/* ———————————————————公用 hub——————————————————————— */

/** 
 * 数据转换通用结构的mark 「数据收集结构/数据赋值」
 */
export const ref2ValMark = '@(ref2Val).';
/** 
 * 条件配置的mark
 */
export const condMark = '@(cond).';

/** 
 * 接口的mark
 */
export const apiReqMark = '@(apiReq).';
