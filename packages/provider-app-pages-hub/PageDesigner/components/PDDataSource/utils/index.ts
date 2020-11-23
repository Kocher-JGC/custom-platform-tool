import pick from "lodash/pick";

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

export const wrapInterDatasource = (remoteDSData: any[], type) => {
  const nextState: PD.Datasources = [];
  remoteDSData.length > 0 && remoteDSData.forEach((data) => {
    if (!data) return;
    let takeItem;
    switch (type) {
      case 'TABLE':
        takeItem = takeTableField(data);
        break;
      case 'DICT':
        takeItem = takeDictField(data);
        break;
    }
    nextState.push(takeItem);
  });
  return nextState;
};