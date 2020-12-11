import { InterMeta, TransfromCtx, FieldDataType, InterMetaType, FieldMeta } from "../types";

const genExtralSchemaOfField = (field: FieldMeta) => {
  return {
    schemaId: '',
    fieldId: field.fieldId,
    type: 'string',
    desc: field.name,
    schemaRef: field.fieldCode,
    // schemaType: 'TablePK',`
    schemaType: '',
    widgetRef: '',
    defaultVal: '$ID()',
    code: field.fieldCode,
    fieldRef: '',
  };
};


export const genExtralSchemaOfTablePK = (transfromCtx: TransfromCtx, interMetas: InterMeta[]) => {
  const { extralDsl: { tempSchema } } = transfromCtx;

  interMetas.forEach(({ fields, type, code  }) => {
    if (type !== InterMetaType.DICT_TABLE) {
      const PKField = fields.find(field => {
        const { fieldDataType, } = field;
        return fieldDataType === FieldDataType.PK;
      });
      if (PKField) {
        tempSchema.push(Object.assign(genExtralSchemaOfField(PKField), { schemaType: 'TablePK', schemaId: `${code }.${PKField.fieldCode}` }));
      }
    }
    if (type === InterMetaType.AUX_TABLE) {
      const FKField = fields.find(field => {
        const { fieldDataType } = field;
        return fieldDataType === FieldDataType.FK;
      });
      if (FKField) {
        tempSchema.push(Object.assign(genExtralSchemaOfField(FKField), { schemaType: 'TableFK', schemaId: `${code }.${FKField.fieldCode}` }));
      }
    }
  });

};