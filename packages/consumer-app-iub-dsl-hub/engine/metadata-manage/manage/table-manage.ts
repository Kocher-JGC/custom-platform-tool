import {
  MetaKeyFromTable, FieldKeyFromTable, GetTableMetaFieldKeyP,
  GetMetaInfo, FieldDataMapToFieldMarkDataP, MetaDateParseRes
} from "../types";

import {
  metadataMetaMark, isPageDatasoruceMeta, pickDatasoruceMetaKeyWord,
  TABLE_PATH_SPLIT_MARK, DEFAULT_CODE_MARK
} from "../const";


export const tableManage = ({ allInterfaceList, allColumnsList }: MetaDateParseRes) => {
  /**
   * 获取某个表元数据
   * @param tableMark 表元数据标示
   * @returns TableInfo
   */
  const getTableMeta = (tableMark: string) => {
    return allInterfaceList[tableMark] || false;
  };
  /**
   * 获取表元数据的某个关键字的信息
   * @param tableMark 表元数据标示
   * @param keywordKey 关键字key
   * @returns string
   */
  const getTableMetaKeyInfo = (tableMark: string, keywordKey: MetaKeyFromTable = 'code') => {
    const table = getTableMeta(tableMark);
    return table ? table?.[keywordKey] : false;
  };

  /**
   * 获取某个字段信息
   * @param fieldMark 字段信息唯一标示
   * @returns ColumnItem columnsInfo
   */
  const getTableFieldInfo = (fieldMark: string) => {
    const columnsInfo = allColumnsList[fieldMark];
    if (columnsInfo) {
      return columnsInfo;
    }
    console.error('未在表元数据中找到对应field对应的关键字!~~', fieldMark);
    return false;
  };

  /**
   * 获取字段信息的某个关键字信息
   * @param fieldMark 字段信息唯一标示
   * @param keywordKey 关键字key
   * @returns string
   */
  const getTableFieldKeyInfo = (fieldMark: string, keywordKey: FieldKeyFromTable = DEFAULT_CODE_MARK) => {
    const fieldInfo = getTableFieldInfo(fieldMark);
    return fieldInfo?.[keywordKey] || false;
  };

  /**
   * 获取表元数据的字段关键字信息
   * @param Param 参数
   * @returns string[]
   */
  const getTableMetaFieldKey = ({
    metaMark,
    metaOnlyMark = 'id',
    fieldKey = DEFAULT_CODE_MARK
  }: GetTableMetaFieldKeyP) => {
    let table;
    if (metaOnlyMark === 'id') {
      table = getTableMeta(metaMark);
      if (table) {
        const fieldKeys = table?.columns?.map((fieldMark) => getTableFieldKeyInfo(fieldMark, fieldKey));
        return fieldKeys;
      }
      console.warn('表元数据信息获取有误');
      return false;
    }
    console.warn('未支持, 请扩展');
    return false;
  };

  /**
   * 添加新的表的元数据
   * @param tableMark 表元数据的唯一标示
   * @param metadata 元数据
   */
  const addMetaFromTable = (tableMark: string, metadata) => {
    if (!getTableMeta(tableMark)) {
      allInterfaceList[tableMark] = metadata;
      // TODO: 未完成
      // allColumnsList, allColumnsIdMarks
    }
  };

  /**
   * TODO: 目前仅支持了一个元数据
   * 将表字段数据转为字段唯一标示的数据
   * 如: { username: '张三' } 转换为 { @(metadata).dId1: '张三' }
   * @param param0 转换必要参数
   */
  const tableFieldDataMapToFieldMarkData = ({
    fieldData,
    fieldKey = DEFAULT_CODE_MARK,
    meta,
  }: FieldDataMapToFieldMarkDataP) => {
    const result = {};
    const { id, columns, columnsList } = meta;
    // addMetaFromTable(id, meta);

    const fieldKeyVals = Object.keys(fieldData);
    columns.forEach((mark) => {
      const fieldKeyVal = columnsList[mark][fieldKey];
      if (fieldKeyVal) {
        const idx = fieldKeyVals.indexOf(fieldKeyVal);
        if (idx > -1) {
          result[metadataMetaMark + mark] = fieldData[fieldKeyVals[idx]];
        }
      }
    });

    return result;
  };

  /**
   * 根据唯一标示获取元数据,「未完成: 可以获取多表, 多字段, 是不是应该有一个总的获取方法」
   * @param marks 唯一标示的数组
   */
  const getTableMetaFromMark = (marks: string[]) => {
    /** 生成函数 */
    const getMetaInfo = marks
      .filter(isPageDatasoruceMeta)
      .map(pickDatasoruceMetaKeyWord)
      .reduce((res, m) => {
        const [tableMark] = m.split(TABLE_PATH_SPLIT_MARK);
        if (!res.tableMark.includes(tableMark)) {
          res.tableMark.push(tableMark);
        }
        (res[tableMark] || (res[tableMark] = [])).push(m);
        return res;
      }, {
        tableMark: []
      } as GetMetaInfo);

    /** 获取函数, TODO: 目前仅获取了表格, 还有字段 */
    return getMetaInfo.tableMark.map((mark) => ({ ...getTableMeta(mark) }));
  };

  return {
    getTableMeta,
    getTableMetaKeyInfo,
    getTableFieldInfo,
    getTableFieldKeyInfo,
    getTableMetaFieldKey,
    getTableMetaFromMark,
    tableFieldDataMapToFieldMarkData
  };
};
