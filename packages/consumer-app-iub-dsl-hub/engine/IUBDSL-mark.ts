const pubTestFn = (regExp: RegExp) => (text: string) => regExp.test(text);
const pubPickFn = (regExp: RegExp) => (text:string) => text.replace(regExp, '') || text;


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
export const ref2ValueMark = '@(ref2Value).';
/** 数据源的元数据 AOP/util */
const ref2ValueRegExp = /^@\(ref2Value\)\./;
export const isRef2Value = pubTestFn(ref2ValueRegExp);
export const pickRef2ValueMark = pubPickFn(ref2ValueRegExp);
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
// @(inter).
export const interMark = '@(inter).';
/** 数据源的元数据 AOP/util */
const interRegExp = /^@\(inter\)\./;
export const isInter = pubTestFn(interRegExp);
export const pickInterMark = pubPickFn(interRegExp);
/* ———————————————————公用 hub——————————————————————— */
