import { ColumnItem, TableInfo } from ".";

export interface MetaDateParseRes {
  /** 所有表的列表 */
  allInterfaceList: { [tableId: string]: TableInfo };
  /** 所有列的信息 */
  allColumnsList: { [markId: string]: ColumnItem };
  /** code标示转换成id标示 */
  codeMarkMapIdMark: { [code: string]: string };
  idMarkMapCodeMark: { [code: string]: string };
  /** 所有字段的id标示 */
  // allColumnsIdMarks: string[];
}

export interface getMetadataParam {
  table: string[];
  [str: string]: string[];
}

export interface ParseMetaDataCtx {
  baseMark: string;
  baseCodeMark: string;
  codeMarkMapIdMark: { [codeMark: string]: string };
  idMarkMapCodeMark: { [codeMark: string]: string };
}
