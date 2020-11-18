import { DEFAULT_CODE_MARK, TABLE_PATH_SPLIT_MARK } from "../const";

import {
  ColumnItem, ParseMetaDataCtx, TableMetadata, MetaDateParseRes
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

  const {
    baseMark, baseCodeMark,
    codeMarkMapIdMark, idMarkMapCodeMark
  } = ctx;


  let columnsList: { [mark: string]: ColumnItem } = {};
  let tablePKInfo: any;


  for (let i = 0; i < columns.length; i++) {
    const columnInfo = columns[i];
    const mark = baseMark + columnInfo.id;
    const codeMark = baseCodeMark + columnInfo[DEFAULT_CODE_MARK];

    // columnsIdMarks.push(mark);
    codeMarkMapIdMark[codeMark] = mark;
    idMarkMapCodeMark[mark] = codeMark;

    columnsList = {
      ...columnsList,
      [mark]: parseColumn(columnInfo)
    };

    if (columnInfo.dataType === 'PK') {
      tablePKInfo = columnInfo;
    }
  }
  return {
    columnsIdMarks: Object.keys(idMarkMapCodeMark),
    columnsList,
    tablePKInfo
  };
};



const initialMetaDataParseRes = (): MetaDateParseRes => ({
  allInterfaceList: {},
  allColumnsList: {},
  codeMarkMapIdMark: {},
  idMarkMapCodeMark: {},
  // allColumnsIdMarks: [],
});


export const parseTableMetadata = (tableMetadatas: TableMetadata[]) => {
  const tableIds: string[] = [];
  const metaDateParseRes = initialMetaDataParseRes();

  const {
    allColumnsList, allInterfaceList,
    codeMarkMapIdMark, idMarkMapCodeMark
  } = metaDateParseRes;


  let baseMark = '';
  let baseCodeMark = '';

  for (let i = 0; i < tableMetadatas.length; i++) {
    const tableInfo = tableMetadatas[i];
    // tableIds.push(tableInfo.id);
    /** 添加标志数据 */
    baseMark = tableInfo.id + TABLE_PATH_SPLIT_MARK;
    baseCodeMark = tableInfo.code + TABLE_PATH_SPLIT_MARK;
    codeMarkMapIdMark[tableInfo.code] = tableInfo.id;
    idMarkMapCodeMark[tableInfo.id] = tableInfo.code;

    /** 列解析 */
    const { columnsIdMarks, columnsList, tablePKInfo } = parseColumns(tableInfo.columns, {
      baseMark, baseCodeMark, codeMarkMapIdMark, idMarkMapCodeMark
    });

    /** 添加表格信息 */
    allInterfaceList[tableInfo.id] = {
      ...tableInfo,
      PKInfo: tablePKInfo,
      columnsList,
    };


    /** 添加allColumnsIdMarks信息 */
    // allColumnsIdMarks.push(...columnsIdMarks);

    /** 添加columns信息 */
    Object.assign(allColumnsList, columnsList);
  }
  return metaDateParseRes;
};
