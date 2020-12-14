import { message as AntdMessage } from 'antd';
import pick from 'lodash/pick';

type RemoteDSData = {id: string, name: string, type: string, auxTable: {containAuxTable?:boolean}}
/**
 * 提取由后端返回的，前端需要的 columns
 */
export const takeColumnsData = (columns: any[], dsID: string): {[key:string]: PD.Column} => {
  const result = {};
  columns.forEach((column) => {
    // console.log('column', column);
    result[column.id] = {
      id: column.id,
      name: column.name,
      colDataType: column.dataType,
      fieldSize: column.fieldSize,
      fieldType: column.fieldType,
      dataType: column.dataType,
      fieldCode: column.code,
      dsID
    };
  });
  return result;
};

/**
 * 从后端返回的数据提取前端需要用到的数据
 */
export const takeTableField = (datasourceData): PD.Datasource => {
  const resData = Object.assign({}, pick(
    datasourceData, [
      'name',
      'id',
      'moduleId',
      'code',
    ]
  ), {
    tableType: datasourceData.type,
    columns: takeColumnsData(datasourceData.columns, datasourceData.id)
  });
  return resData;
};

/**
 * 从
 * @param datas 
 */
export const takeTable = async (tableList: RemoteDSData[]) => {
  if(tableList.length === 0){
    return {
      decorativeData: [],
      remoteData: []
    };
  }
  /** 获取请求表数据参数 */
  const getTablesParam = () => {
    return tableList.map(item=>({
      tableId: item.id,
      addWithAuxTable: item.auxTable.containAuxTable
    }));
  };
  /** 获取剩余的表配置 */
  const getTableConfig = () => {
    const result = {};
    tableList.forEach(item=>{
      const { id, auxTable } = item;
      result[id] = { auxTable };
    });
    return result;
  };
  /** 拼接表格索引 */
  // const getTablesOrder = () =>{
  //   const map = {};
  //   tableList.forEach(item=>{
  //     const { id, order } = item;
  //     map[id] = order;
  //   });
  //   return map;
  // };
  const { code, result, msg } = await $R_P.post({
    url: '/data/v1/tables/tableWithAux',
    data: { tables: getTablesParam() }
  });
  if(code !== '00000') {
    AntdMessage.error('获取数据表数据失败，请联系技术人员');
    return {
      decorativeData: [],
      remoteData: []
    };
  }
  // const orderMap = getTablesOrder();
  // const res = {};
  // result.forEach(item=>{
  //   const { id } = item;
  //   const order = orderMap[id];
  //   res[order] = takeTableField(item);
  // });
  // return res;
  const tableConfig = getTableConfig();
  return {
    decorativeData: result.map(item=>({ ... takeTableField(item), ...tableConfig[item.id] })),
    remoteData: result
  };
};
/**
 * 提取由后端返回的，前端需要的 columns
 */
export const takeDictItems = (dsID) => {
  return {
    code: { name: '编码', code: 'code', id: 'code', dsID },
    name: { name: '名称', code: 'name', id: 'name', dsID },
    pid: { name: '父编码', code: 'pid', id: 'pid', dsID }
  };
};
/**
 * 从后端返回的字典数据提取前端需要用到的数据
 */
export const takeDictField = (datasourceData:RemoteDSData) => {
  return Object.assign({}, pick(
    datasourceData, [
      'name',
      'id',
      'code',
    ]
  ), {
    dictType: datasourceData.type, 
    columns: takeDictItems(datasourceData.id)
  });
};
const makeTypeForList = (list, type) => {
  return Array.isArray(list) ? list.map(item=>({
    ...item,
    type
  })) : []
}
export const wrapInterDatasource = async (remoteDSData: RemoteDSData[]) => {
  // const nextState: PD.Datasources = [];
  const tableList: RemoteDSData[] = []; const nextDictList = []; const remoteDictList: RemoteDSData[] = [];
  remoteDSData.length > 0 && remoteDSData.forEach((data, order) => {
    if (!data) return;
    switch (data.type) {
      case 'TABLE':
        tableList.push(data);
        break;
      case 'DICT':
        remoteDictList.push(data);
        nextDictList.push(takeDictField(data));
        break;
    }
  });
  const {
    decorativeData: nextTableList,
    remoteData: remoteTableList
  } = await takeTable(tableList);
  return {
    decorativeData: [
      ...makeTypeForList(nextTableList, 'TABLE'), 
      ...makeTypeForList(nextDictList, 'DICT')],
    remoteData: [...remoteTableList, ...remoteDictList]
  };
};