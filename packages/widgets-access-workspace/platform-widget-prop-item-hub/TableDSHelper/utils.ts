
import { nanoid } from 'nanoid';
import { DATATYPE } from '@provider-app/table-editor/constants';
/**
 * 模拟生成 row 数据
 */
export const genRowData = (usingColumns, rowCount = 3) => {
  const resData:{[key:string]: string|number}[] = [];
  [...Array(rowCount)].forEach((_, _idx) => {
    const rowItem:{[key:string]: string|number} = {};
    usingColumns.forEach((col, idx) => {
      // const { id, name, fieldCode } = col;
      Object.keys(col).forEach(colKey=>{
        if (Object.prototype.hasOwnProperty.call(col, colKey)) {
          rowItem[colKey] = '';
        }
      });
      rowItem.id = _idx;
    });
    resData.push(rowItem);
  });
  return resData;
};


export const isReferenceField = (dataType) => {
  return [DATATYPE.DICT, DATATYPE.FK, DATATYPE.QUOTE].includes(dataType);
};
/**
 * 模拟生成 row 数据
 */
export const genRenderColumn = (usingColumn) => {
  const { id: fieldID, name: title, dsID, colDataType } = usingColumn;
  const id = `field.dsColumn.${nanoid(8)}`;
  return {
    title, dsID, fieldID,
    id, dataIndex: id,
    width: '60px',
    type: 'dsColumn',
    fieldShowType: isReferenceField(colDataType) ? 'showVal' : 'realVal',
    show: true
  };
};