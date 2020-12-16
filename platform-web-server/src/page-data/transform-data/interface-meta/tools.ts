import { InterMetaType, RemoteTableColumn, FieldDataType, Species } from "../../types";

/**
 * 获取表类型枚举值
 * @param type 表类型
 */
export const getTableType = (type: string): InterMetaType  => {
  return {
    TREE: InterMetaType.TREE_TABLE, // (普通表) 
    TABLE: InterMetaType.NORMAL_TABLE, // (树形表) 
    AUX_TABLE: InterMetaType.AUX_TABLE, // (附属表)
    DICT: InterMetaType.DICT_TABLE
  }[type];
};

/**
 * 获取字段数据类型枚举值
 * @param info 表列信息
 */
export const getFieldDataType = (info: RemoteTableColumn): FieldDataType => {
  if (info.dataType === FieldDataType.PK) return FieldDataType.PK;
  if (info.dataType === FieldDataType.FK) return FieldDataType.FK;

  if (info.species === Species.SYS_TMPL) {
    return FieldDataType.SYS;
  }
  return info.dataType as FieldDataType || FieldDataType.SYS;
};
