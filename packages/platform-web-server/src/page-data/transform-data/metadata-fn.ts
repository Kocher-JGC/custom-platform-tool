import axios from 'axios';
import { genUrl } from '../utils';
import { ProcessCtx, TransfromCtx } from './types';

const sysFieldKey = [
  'create_user_id', 'last_update_time', 'last_update_user_id', 
  'sequence', 'create_time', 'data_version', 'last_update_user_name', 'create_user_name'
];

interface RemoteColInfo {
  id: string;
  name: string;
  code: string;
  fieldType: string;
  fieldSize: string;
  dataType: string;
}

interface RemoteTableMeta {
  columns: RemoteColInfo[]
  id: string
  name: string;
  code: string;
  type: 'TABLE';
  moduleId: string
  moduleName: string;
  species: 'BIS'
  references: any[];
  foreignKeys: any[]
  relationTables: any[]
}

interface MetadataFromTable {
  /** 元数据引用的ID */
  tableRefId: string;
  /** 表格类型 普通表/字典 */
  tableType: string;
  /** 表的Id */
  id: string;
  name: string;
  code: string;
  type: string;
  moduleId: string;
  columns: any;
}

/** 转换columns */
const transformCols = (columns: RemoteColInfo[]) => {
  return columns
    // 过滤系统字段
    .filter(info => !sysFieldKey.includes(info.code))
    .map(info => ({
      id: info.id,
      name: info.name,
      fieldCode: info.code,
      fieldType: info.fieldType,
      fieldSize: info.fieldSize,
      dataType: info.dataType,
      colDataType: info.dataType,
      type: 'string',
    })).reduce((res, val) => ({ ...res, [val.id]: val }), {});
};

/** 后端的meta生成meta */
const genMetadataFromRemoteTableMeta = (tableMeta: RemoteTableMeta, extralData = { tableRefId: '', tableType: '' }) => {
  return {
    id: tableMeta.id,
    name: tableMeta.name,
    code: tableMeta.code,
    type: 'general',
    moduleId: tableMeta.moduleId,
    columns: transformCols(tableMeta.columns),
    ...extralData
  };
};

/**
 * post获取 http://192.168.14.181:6090/paas/hy/7899/data/v1/tables/tableWithAux
 * {
  "tables":[
     {
        "tableId":"1330688851571777536",
        "addWithAuxTable":false
     },{
        "tableId":"1330688706906038272",
        "addWithAuxTable":false
     }  
    ]
  }
 */
/**
 * list获取 http://192.168.14.181:6090/paas/hy/7899/data/v1/tables/list
 * 默认100条一页
 */
/**
 * get获取
 */
const getRemoteTableMeta = async ({ token, lessee, app, tableId }): Promise<RemoteTableMeta | false> => {
  const reqUrl = `${genUrl({ lessee, app })}/data/v1/tables/${tableId}`;
  console.log(reqUrl);
  
  const resData = await axios
    .get(reqUrl, {
      headers: {
        Authorization: token
      }
    });
  const data = resData?.data?.result;
  // console.log('------------ Table Data -----------');
  // console.log(data);
  if (data) {
    return data;
  } 
  // return {
  //   err: JSON.stringify(resData.data)
  // };
  return false;
};

export const findTableMetadata = (tableMetadata: MetadataFromTable[], idOrRef: string) => {
  return tableMetadata.find(d => d.id === idOrRef || d.tableRefId === idOrRef);

};

/** TODO: tempCode */
export const genExtralSchema = (transfromCtx: TransfromCtx, tableMetadata: MetadataFromTable, isAll = false) => {
  const { extralDsl: { tempSchema } } = transfromCtx;
  if (tableMetadata && Reflect.has(tableMetadata, 'id') && Reflect.has(tableMetadata, 'columns')) {
    const { columns, id } = tableMetadata;
    const coulumsIds = Object.keys(columns);
    const cc = coulumsIds?.map((coulumsId) => {
      const info = columns[coulumsId];
      if (info.dataType === 'PK') {
        return {
          schemaId: info.id,
          name: info.name,
          type: 'string',
          fieldMapping: `@(metadata).${id}.${info.id}`,
          isPk: true,
          fieldCode: info.fieldCode,
          defaultVal: '$ID()'
        };
      }
      if (isAll) {
        return {
          name: info.name,
          schemaId: info.id,
          type: 'string',
          fieldCode: info.fieldCode,
          fieldMapping: `@(metadata).${id}.${info.id}`,
        };
      }
      return null;
    }).filter(v => v);
    if (isAll) {
      const structArr = {
        schemaId: id,
        collectionType: 'structArray',
        struct: cc
      };
      tempSchema.push(structArr);
    }
    tempSchema.push(...cc);
    return { columns: cc, id };
  }
  return null;
};

export const genTableMetadata = async (dataSource: any, processCtx: ProcessCtx): Promise<MetadataFromTable[]> => {
  if (Array.isArray(dataSource)) {
    const remoteTableMeta = Promise.all(dataSource.map((info) => {
      return getRemoteTableMeta({ ...processCtx, tableId: info.datasourceId });
    }));
    return (await remoteTableMeta)
      .filter(v => v)
      .map(d => genMetadataFromRemoteTableMeta(d as RemoteTableMeta));
  }
  if (typeof dataSource === 'object') {
    const tableRefIdx = Object.keys(dataSource);
    const r = tableRefIdx.map(async (tableRefId) => {
      const info = dataSource[tableRefId];
      const { tableInfo, type, columns, id } = info;
      const tableId = tableInfo?.id || id;
      if (tableId) {
        const remoteTableMeta = await getRemoteTableMeta({ ...processCtx, tableId });
        if (remoteTableMeta) {
          return genMetadataFromRemoteTableMeta(remoteTableMeta, { tableRefId, tableType: type });
        } 
      } else if (Array.isArray(columns)) {
        info.columns = transformCols(info.columns);
        return info;
      }
      return null;
    });
    return (await Promise.all(r)).filter(v => v);
  }
  return [];
};


export const genMetadataPkSchema = (transfromCtx: TransfromCtx, tableMetadata: MetadataFromTable[]) => {
  const { extralDsl: { tempSchema } } = transfromCtx;
  tableMetadata.forEach(d => {
    const PKCol = Object.keys(d.columns).map(k => (d.columns[k])).find(col => col.dataType === 'PK');
    if (PKCol) {
      tempSchema.push(
        {
          schemaId: PKCol?.id,
          name: PKCol?.name,
          type: 'string',
          tableId: d.id,
          tableRefId: d.tableRefId,
          tableType: d.tableType,
          fieldMapping: `@(metadata).${d.id}.${PKCol?.id}`,
          isPk: true,
          fieldCode: PKCol?.fieldCode,
          defaultVal: '$ID()'
        }
      );
    }
  });

};