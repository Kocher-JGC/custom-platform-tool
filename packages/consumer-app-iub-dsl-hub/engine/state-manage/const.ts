/** 对象的分割 */
export const PATH_SPLIT_MARK = '/';
/** 数组的标示 */
export const ARR_MARK = '[]';

/** 数组的分割 */
export const PATH_SPLIT_MARK_ARR = ARR_MARK + PATH_SPLIT_MARK;
/** schemas中的key */
export const SCHEMAS_DEFAULT_KEY = 'SCHEMAS_KEY';
export type SCHEMAS_DEFAULT_KEY_TYPE = 'SCHEMAS_KEY';

/** 状态管理的AOP/util */
const pageSchemasRegExp = /^@\(schema\)\./;

export const isPageState = (text: string) => pageSchemasRegExp.test(text);
export const pickPageStateKeyWord = (text:string) => text.replace(pageSchemasRegExp, '') || text;
