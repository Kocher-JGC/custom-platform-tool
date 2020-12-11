const pubTestFn = (regExp: RegExp) => (text = '') => regExp.test(text);
const pubPickFn = (regExp: RegExp) => (text = '') => text.replace(regExp, '') || text;


// /^@\([^\\)]+\)\./g

export const isIUBDSLMark = (str: string) => /^@\([^\\)]+\)\./.test(str);

export const defaultPickMark = (str: string) => {
  const idx = str.indexOf(').') + 2;
  return [str.slice(0, idx), str.slice(idx)];
};

/** 
 * 接口元数据的mark部分
 */
export const interMetaMark = '@(interMeta).';
/** 数据源的元数据 AOP/util */
const interMetaRegExp = /^@\(interMeta\)\./;
export const isInterMeta = pubTestFn(interMetaRegExp);
export const pickInterMetaMark = pubPickFn(interMetaRegExp);

/** 
 * 页面数据的mark
 */
export const schemaMark = '@(schema).';
/** 数据源的元数据 AOP/util */
const schemaRegExp = /^@\(schema\)\./;
export const isSchema = pubTestFn(schemaRegExp);
export const pickSchemaMark = pubPickFn(schemaRegExp);

/** 
 * 运行时上下文
 */
export const runCtxMark = '@(runCtx).';
/** 数据源的元数据 AOP/util */
const runCtxRegExp = /^@\(runCtx\)\./;
export const isRunCtx = pubTestFn(runCtxRegExp);
export const pickRunCtxMark = pubPickFn(runCtxRegExp);

/** 
 * 动作的mark
 */
export const actionMark = '@(action).';
/** 数据源的元数据 AOP/util */
const actionRegExp = /^@\(action\)\./;
export const isAction = pubTestFn(actionRegExp);
export const pickActionMark = pubPickFn(actionRegExp);

/** 
 * 流程配置的mark
 */
export const flowMark = '@(flow).';
/** 数据源的元数据 AOP/util */
const flowRegExp = /^@\(flow\)\./;
export const isFlow = pubTestFn(flowRegExp);
export const pickFlowMark = pubPickFn(flowRegExp);


/* ———————————————————公用 hub——————————————————————— */

/** 
 * 数据转换通用结构的mark 「数据收集结构/数据赋值」
 */
export const ref2ValMark = '@(ref2Val).';
/** 数据源的元数据 AOP/util */
const ref2ValRegExp = /^@\(ref2Val\)\./;
export const isRef2Val = pubTestFn(ref2ValRegExp);
export const pickRef2ValMark = pubPickFn(ref2ValRegExp);
/** 
 * 条件配置的mark
 */
export const condMark = '@(cond).';
/** 数据源的元数据 AOP/util */
const condRegExp = /^@\(cond\)\./;
export const isCond = pubTestFn(condRegExp);
export const pickCondMark = pubPickFn(condRegExp);

/** 
 * 接口的mark
 */
// @(apiReq).
export const apiReqMark = '@(apiReq).';
/** 数据源的元数据 AOP/util */
const apiReqRegExp = /^@\(apiReq\)\./;
export const isapiReq = pubTestFn(apiReqRegExp);
export const pickapiReqMark = pubPickFn(apiReqRegExp);
/* ———————————————————公用 hub——————————————————————— */
