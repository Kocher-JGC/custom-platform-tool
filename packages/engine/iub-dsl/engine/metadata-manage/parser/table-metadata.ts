import { TABLE_PATH_SPLIT_MARK } from '../const';
import {
  ColumnItem, ParseMetaDataCtx, TableInfo, TableMetadata
} from '../types';

const parseColumn = (column: ColumnItem) => {
  return column;
};

const parseColumns = (c: ColumnItem[], ctx: ParseMetaDataCtx) => {
  /** TODO: 还没统一先做兼容处理 */
  let columns;
  if (!Array.isArray(c)) {
    if (typeof c === 'object') {
      columns = Object.values(c) as any;
    } else {
      columns = [];
    }
  } else {
    columns = c;
  }

  const { baseMark } = ctx;

  const columnsIdMarks: string[] = [];
  let columnsList: { [mark: string]: ColumnItem } = {};
  let tablePKInfo: any;

  let mark = '';

  for (let i = 0; i < columns.length; i++) {
    const columnInfo = columns[i];
    mark = baseMark + columnInfo.id;

    columnsIdMarks.push(mark);
    columnsList = {
      ...columnsList,
      [mark]: parseColumn(columnInfo)
    };

    if (columnInfo.dataType === 'PK') {
      tablePKInfo = columnInfo;
    }
  }
  return {
    columnsIdMarks,
    columnsList,
    tablePKInfo
  };
};

export interface MetaDateParseRes {
  allColumnsList: { [mark: string]: ColumnItem };
  allColumnsIdMarks: string[]
  tableList: { [tableId: string]: TableInfo }
}

const initialMetaDataParseRes = (): MetaDateParseRes => ({
  allColumnsList: {},
  tableList: {},
  allColumnsIdMarks: []
});

export const parseTableMetadata = (tableMetadatas: TableMetadata[]) => {
  const tableIds: string[] = [];
  const metaDateParseRes = initialMetaDataParseRes();
  const { allColumnsIdMarks, allColumnsList, tableList } = metaDateParseRes;

  let baseMark = '';
  for (let i = 0; i < tableMetadatas.length; i++) {
    const tableInfo = tableMetadatas[i];
    tableIds.push(tableInfo.id);
    baseMark = tableInfo.id + TABLE_PATH_SPLIT_MARK;
    /** 列解析 */
    const { columnsIdMarks, columnsList, tablePKInfo } = parseColumns(tableInfo.columns, { baseMark });
    /** 添加表格信息 */
    tableList[tableInfo.id] = {
      ...tableInfo,
      PKInfo: tablePKInfo,
      columnsList,
      columns: columnsIdMarks
    };

    /** 添加allColumnsIdMarks信息 */
    allColumnsIdMarks.push(...columnsIdMarks);

    /** 添加columns信息 */
    Object.assign(allColumnsList, columnsList);
  }
  return metaDateParseRes;
};
