/** 表名+字段id分割 */
export const TABLE_PATH_SPLIT_MARK = '.';
/** code标示 */
export const DEFAULT_CODE_MARK = 'fieldCode';

export const metadataMetaMark = '@(metadata).';

/** 数据源的元数据 AOP/util */
const metadataMetaRegExp = /^@\(metadata\)\./;

export const isPageDatasoruceMeta = (text: string) => metadataMetaRegExp.test(text);
export const pickDatasoruceMetaKeyWord = (text:string) => text.replace(metadataMetaRegExp, '') || text;
