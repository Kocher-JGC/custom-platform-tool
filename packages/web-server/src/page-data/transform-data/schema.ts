export const genSchema = (schema: any) => {
  const schemaRes = {};
  const schemaIds = Object.keys(schema);
  schemaIds.forEach((schemaId) =>{
    const schemaInfo = schema[schemaId];
    const { column, tableInfo } = schemaInfo;
    const { id: tableId, name: tableName } = tableInfo;
    const {
      id: columnId, isPk, defaultVal, colDataType, fieldCode, name
    } = column;
    schemaRes[schemaId] = {
      type: 'string',
      fieldMapping: `@(metadata).${tableId}.${columnId}`,
      fieldCode,
      defaultVal,
      name,
      isPk: colDataType === 'PK',

    };
  });
  return schemaRes;
};
