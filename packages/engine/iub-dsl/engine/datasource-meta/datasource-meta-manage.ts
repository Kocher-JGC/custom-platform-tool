import {
  MetaDateParseRes, TableInfo, parseMetaData, DatasourceItem
} from "./datasource-meta-parser";
import {
  isPageDatasoruceMeta, pickDatasoruceMetaKeyWord, TABLE_PATH_SPLIT_MARK, datasourceMetaMark
} from ".";
import { RunTimeCtxToBusiness, DispatchModuleName, DispatchMethodNameOfIUBStore } from '../runtime/types';
import { isPageState } from "../state-manage";

interface getMetadataParam {
  table: string[];
  [str: string]: string[];
}

export const createMetadataStore = (parseRes: MetaDateParseRes) => {
  console.log(parseRes);

  const { tableList, allColumnsList, allColumnsIdMarks } = parseRes;

  const getTable = (ctx: RunTimeCtxToBusiness, tableMark: string) => {
    if (isPageDatasoruceMeta(tableMark)) {
      tableMark = pickDatasoruceMetaKeyWord(tableMark);
      const table = tableList[tableMark];
      return table?.code;
    } if (isPageState(tableMark)) {
      const tableDatas = ctx.dispatchOfIUBEngine({
        dispatch: {
          module: DispatchModuleName.IUBStore,
          method: DispatchMethodNameOfIUBStore.getSchemaMetadata,
          params: [tableMark]
        }
      });
      return tableDatas?.[0].code || tableMark;
    }
    return tableMark;
  };

  /** 获取某个fieldMark的fieldCode */
  const getFiledCode = (ctx: RunTimeCtxToBusiness, fieldMark: string) => {
    if (isPageDatasoruceMeta(fieldMark)) {
      fieldMark = pickDatasoruceMetaKeyWord(fieldMark);
    } else {
      console.error('非法数据源元数据唯一标示!~~', fieldMark);
      return false;
    }
    if (allColumnsIdMarks.includes(fieldMark)) {
      const columnsInfo = allColumnsList[(fieldMark)];
      return columnsInfo.fieldCode;
    }
    console.error('未找到数据源元数据唯一标示!~~', fieldMark);
    return false;
  };

  /** 获取某个表的fieldsCode */
  const getFiledsCodeFromTable = (ctx: RunTimeCtxToBusiness, tableId: string) => {
    let temp: TableInfo;
    if (
      isPageDatasoruceMeta(tableId)
      && (temp = tableList[pickDatasoruceMetaKeyWord(tableId)])
    ) {
      const filedsCode = temp.columns.map((id) => getFiledCode(ctx, id));
      return filedsCode;
    }
    console.error('非法表ID!');
    return false;
  };

  const getMetadata = (ctx: RunTimeCtxToBusiness, param: string[]) => {
    const getParam = param
      .filter(isPageDatasoruceMeta)
      .map(pickDatasoruceMetaKeyWord)
      .reduce((res, v) => {
        const [table, filed] = v.split(TABLE_PATH_SPLIT_MARK);
        if (!res.table.includes(table)) {
          res.table.push(table);
        }
        (res[table] || (res[table] = [])).push(filed);
        return res;
      }, {
        table: []
      } as getMetadataParam);

    // let temp;
    // return getParam.table.reduce((res, tableMark) => {
    //   if ((temp = tableList[tableMark])) {
    //     res[temp.id] = temp;
    //   }
    //   return res;
    // }, {});
    return getParam.table.map((tableMark) => ({ ...tableList[tableMark] }));
  };

  const fieldCodeMapToFieldMark = (ctx: RunTimeCtxToBusiness, fieldCodeData, metadata) => {
    const fieldKeys = Object.keys(fieldCodeData);
    const { columnsList, columns } = metadata;
    const result = {};
    columns.forEach((mark) => {
      const { fieldCode } = columnsList[mark];
      if (fieldCode) {
        const idx = fieldKeys.indexOf(fieldCode);
        if (idx > -1) {
          result[datasourceMetaMark + mark] = fieldCodeData[fieldKeys[idx]];
        }
      }
    });

    return result;
  };

  return {
    getTable,
    getFiledCode,
    getFiledsCodeFromTable,
    getMetadata,
    fieldCodeMapToFieldMark
  };
};

export const datasourceMetaHandle = (datasources: DatasourceItem[] = []) => {
  const parseRes = parseMetaData(datasources);
  return createMetadataStore(parseRes);
};
