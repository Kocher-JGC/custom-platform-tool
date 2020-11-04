/** 表名+字段id分割 */
export const TABLE_PATH_SPLIT_MARK = '.';

export const datasourceMetaMark = '@(metadata).';

/** 数据源的元数据 AOP/util */
const datasoruceMetaRegExp = /^@\(metadata\)\./;

export const isPageDatasoruceMeta = (text: string) => datasoruceMetaRegExp.test(text);
export const pickDatasoruceMetaKeyWord = (text:string) => text.replace(datasoruceMetaRegExp, '') || text;
