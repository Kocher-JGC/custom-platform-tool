/**
 * 表的列信息
 */

import { MetaType } from ".";

export interface ColumnItem {
  id: string
  name: string
  /** 数据类型 */
  colDataType: string
  /** 字段 size */
  fieldSize: string
  /** 字段类型 */
  fieldType: string
  /** 字段的名字 */
  fieldCode: string
}

export interface TableMetadata {
  metaType: MetaType.table
  /** 该条记录的 id */
  id: string
  /** 名字 */
  name: string
  /** 类型 */
  type: string
  /** columns */
  columns: ColumnItem[]
  code: string;
}
