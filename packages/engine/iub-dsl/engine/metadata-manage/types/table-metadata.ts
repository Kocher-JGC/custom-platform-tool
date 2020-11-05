import { ColumnItem, TableMetadata } from "@iub-dsl/definition";

export {
  ColumnItem,
  TableMetadata
};
export interface TableInfo {
  /** 该条记录的 id */
  id: string;
  /** 该条记录关联的表的 id */
  moduleId: string;
  /** 名字 */
  name: string;
  /** 类型 */
  type: string;
  /** columns-mark */
  columns: string[];
  PKInfo: ColumnItem;
  columnsList: {
    [mark: string]: ColumnItem;
  }
  code: string;
}

export type MetaKeyFromTable = Exclude<keyof TableInfo, 'columnsList' | 'columns' | 'type' >
export type TableOnlyMark = Extract<keyof TableInfo, 'id' | 'code' >
export type FieldKeyFromTable = Exclude<keyof ColumnItem, ''>

export interface GetMetaInfo {
  tableMark: string[];
  [tableMark: string]: string[];
}
export interface GetTableMetaFieldKeyP {
  metaMark: string;
  metaOnlyMark?: TableOnlyMark
  fieldKey?: FieldKeyFromTable
}

export interface FieldDataMapToFieldMarkDataP {
  fieldKey?: FieldKeyFromTable;
  fieldData: { [str:string]: string};
  meta: TableInfo
}
