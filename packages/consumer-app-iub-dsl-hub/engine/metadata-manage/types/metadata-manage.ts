import { ColumnItem, TableInfo } from ".";

export interface MetaDateParseRes {
  allColumnsList: { [mark: string]: ColumnItem };
  allColumnsIdMarks: string[]
  tableList: { [tableId: string]: TableInfo }
}

export interface getMetadataParam {
  table: string[];
  [str: string]: string[];
}

export interface ParseMetaDataCtx {
  baseMark: string
}
