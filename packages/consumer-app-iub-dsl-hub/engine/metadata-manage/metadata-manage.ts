import { metadataParser } from './parser';
import { tableManage } from './manage/table-manage';
import { MetaDateParseRes, MetadataCollection } from "./types";
import { isPageDatasoruceMeta, pickDatasoruceMetaKeyWord } from ".";
import { RunTimeCtxToBusiness, DispatchModuleName, DispatchMethodNameOfIUBStore } from '../runtime/types';
import { isPageState } from "../state-manage";

export const createMetaManageEntity = (parseRes: MetaDateParseRes) => {
  console.log(parseRes);
  const {
    getTableMeta, getTableMetaKeyInfo,
    getTableFieldInfo, getTableFieldKeyInfo,
    getTableMetaFieldKey, getTableMetaFromMark,
    tableFieldDataMapToFieldMarkData
  } = tableManage(parseRes);


  /**
   * 获取某个元数据的关键字信息
   * @param ctx 运行时上下文
   * @param mark 唯一标示
   */
  const getMetaKeyInfo = (ctx: RunTimeCtxToBusiness, mark: string) => {
    if (isPageDatasoruceMeta(mark)) {
      mark = pickDatasoruceMetaKeyWord(mark);
      return getTableMetaKeyInfo(mark);
    }
    /** 临时的, mark是schema里面得 */
    if (isPageState(mark)) {
      const metadataData = ctx.dispatchOfIUBEngine({
        dispatch: {
          module: DispatchModuleName.IUBStore,
          method: DispatchMethodNameOfIUBStore.getSchemaMetadata,
          params: [mark]
        }
      });
      /** 临时 */
      return metadataData?.[0].code || mark;
    }
    return mark;
  };

  /**
   * 获取某个元数据的字段的关键字信息
   * @param ctx 运行时上下文
   * @param fieldMark 字段的唯一标示
   */
  const getFieldKeyInfo = (ctx: RunTimeCtxToBusiness, fieldMark: string) => {
    if (isPageDatasoruceMeta(fieldMark)) {
      fieldMark = pickDatasoruceMetaKeyWord(fieldMark);
    } else {
      console.error('非法数据源元数据唯一标示!~~', fieldMark);
      return false;
    }
    /** TODO: 目前仅有表的 */
    return getTableFieldKeyInfo(fieldMark);
  };

  /**
   * 获取某个元数据的字段关键字信息
   * @param ctx 运行时上下文
   * @param metaMark 元数据的唯一标示
   */
  const getMetaFieldKey = (ctx: RunTimeCtxToBusiness, metaMark: string) => {
    // TODO: 目前仅支持了表格的
    return getTableMetaFieldKey({ metaMark });
  };

  /**
   * 根据唯一标示获取元数据信息
   * @param ctx 运行时上下文
   * @param marks 唯一标示的数组
   */
  const getMetaFromMark = (ctx: RunTimeCtxToBusiness, marks: string[]) => {
    // TODO: 目前仅支持了表格的
    return getTableMetaFromMark(marks);
  };

  /**
   * 将Key为元数据字段的数据转化为key为唯一标示的数据
   * 如: { username: '张三' } 转换为 { @(metadata).dId1: '张三' }
   * @param ctx 运行时上下文
   * @param fieldData 字段数据
   * @param meta 元数据
   */
  const fieldDataMapToFieldMarkData = (ctx: RunTimeCtxToBusiness, fieldData, meta) => {
    // TODO: 目前仅支持了表格的
    return tableFieldDataMapToFieldMarkData({ meta, fieldData });
  };

  return {
    getMetaKeyInfo,
    getFieldKeyInfo,
    getMetaFieldKey,
    getMetaFromMark,
    fieldDataMapToFieldMarkData
  };
};

export const metadataManage = (datasources: MetadataCollection) => {
  const parseRes = metadataParser(datasources);
  return createMetaManageEntity(parseRes);
};
