/**
 * 模拟生成 row 数据
 */
export const genRowData = (usingColumns, rowCount = 3) => {
  const resData = [];
  [...Array(rowCount)].forEach((_, _idx) => {
    const rowItem = {};
    usingColumns.forEach((col, idx) => {
      // const { id, name, fieldCode } = col;
      for (const colKey in col) {
        if (Object.prototype.hasOwnProperty.call(col, colKey)) {
          rowItem[colKey] = '';
        }
      }
      rowItem.id = _idx;
    });
    resData.push(rowItem);
  });
  return resData;
};


/**
 * 模拟生成 row 数据
 */
export const genRenderColumn = (usingColumns) => {
  const resData = [];
  const colItem = {};
  usingColumns.forEach((col, idx) => {
    const { name, fieldCode, ...other } = col;
    colItem[fieldCode] = '';
    resData.push({
      ...other,
      title: name,
      dataIndex: fieldCode,
    });
  });
  return resData;
};