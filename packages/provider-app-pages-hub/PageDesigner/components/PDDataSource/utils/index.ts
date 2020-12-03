import pick from "lodash/pick";
import { message as AntdMessage } from 'antd';

/**
 * 提取由后端返回的，前端需要的 columns
 */
export const takeColumnsData = (columns: any[]): PD.Column[] => {
  return columns.map((column) => {
    // console.log('column', column);
    return {
      id: column.id,
      name: column.name,
      colDataType: column.dataType,
      fieldSize: column.fieldSize,
      fieldType: column.fieldType,
      fieldCode: column.code,
    };
  });
};

/**
 * 从后端返回的数据提取前端需要用到的数据
 */
export const takeTableField = (datasourceData): PD.Datasource => {
  const resData = Object.assign({}, pick(
    datasourceData, [
      'name',
      'id',
      'type',
      'moduleId',
      'code',
    ]
  ), {
    columns: takeColumnsData(datasourceData.columns)
  });
  return resData;
};

/**
 * 从
 * @param datas 
 */
export const takeTable = async (tableList) => {
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
export const takeDictItems = (datas: any[]) => {
  return datas.map((column) => {
    // console.log('column', column);
    return pick(
      column, [
        'name',
        'code',
        'id',
        'hasChild',
      ]
    );
  });
};
/**
 * 从后端返回的字典数据提取前端需要用到的数据
 */
export const takeDictField = (datasourceData) => {
  return Object.assign({}, pick(
    datasourceData, [
      'name',
      'id',
      'type',
      'code',
    ]
  ), {
    items: takeDictItems(datasourceData.items)
  });
};

export const wrapInterDatasource = async (remoteDSData: any[]) => {
  // const nextState: PD.Datasources = [];
  const tableList = [], dictList = [];
  remoteDSData.length > 0 && remoteDSData.forEach((data, order) => {
    if (!data) return;
    switch (data.type) {
      case 'TABLE':
        tableList.push(data);
        break;
      case 'DICT':
        dictList.push(data);
        break;
    }
  });
  const {
    decorativeData: nextTableList,
    remoteData: remoteTableList
  } = await takeTable(tableList);
  return {
    decorativeData: [...nextTableList],
    remoteData: [...remoteTableList]
  };
};