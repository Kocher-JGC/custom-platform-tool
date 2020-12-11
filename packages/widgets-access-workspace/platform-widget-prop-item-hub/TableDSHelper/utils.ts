
import { nanoid } from 'nanoid';
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
export const genRenderColumn = (usingColumn) => {
  const { id: fieldID, name: title, tableID: dsID, dataType } = usingColumn;
  return {
    title, dsID, fieldID,
    id: `field.dsColumn.${nanoid(8)}`,
    width: '60px',
    type: 'dsColumn',
    show: true
  };
};