import { InterMeta, TransfromCtx, FieldDataType, InterMetaType, FieldMeta } from "../types";
import { schemaMark } from "./IUBDSL-mark";

const genExtralSchemaOfField = (interId: string, field: FieldMeta) => {
  return {
    schemaId: '',
    fieldId: field.fieldId,
    interId,
    type: 'string',
    desc: field.name,
    schemaRef: '',
    schemaType: '',
    defaultVal: '$ID()',
    code: field.fieldCode,
  };
};


export const genExtralSchemaOfTablePK = (transfromCtx: TransfromCtx, interMetas: InterMeta[]) => {
  const { extralDsl: { tempSchema } } = transfromCtx;

  interMetas.forEach(({ fields, type, code, id  }) => {
    if (type !== InterMetaType.DICT_TABLE) {
      const PKField = fields.find(field => {
        const { fieldDataType, } = field;
        return fieldDataType === FieldDataType.PK;
      });
      if (PKField) {
        tempSchema.push(Object.assign(genExtralSchemaOfField(id, PKField), { schemaType: 'TablePK', schemaId: `${id}_${PKField.fieldId}`, schemaRef: `${schemaMark}${id}_${PKField.fieldId}` }));
      }
    }
    if (type === InterMetaType.AUX_TABLE) {
      const FKField = fields.find(field => {
        const { fieldDataType } = field;
        return fieldDataType === FieldDataType.FK;
      });
      if (FKField) {
        tempSchema.push(Object.assign(genExtralSchemaOfField(id, FKField), { schemaType: 'TableFK', schemaId: `${id}_${FKField.fieldId}`, schemaRef: `${schemaMark}${id}_${FKField.fieldId}` }));
      }
    }
  });

};