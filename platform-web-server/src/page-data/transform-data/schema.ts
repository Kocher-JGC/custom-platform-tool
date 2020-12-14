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
  const { extralDsl: { tempSchema }, pkSchemaRef } = transfromCtx;

  interMetas.forEach(({ fields, type, code, id  }) => {
    if (type !== InterMetaType.DICT_TABLE) {
      const PKField = fields.find(field => {
        const { fieldDataType, } = field;
        return fieldDataType === FieldDataType.PK;
      });
      if (PKField) {
        const schemaId = `${id}_${PKField.fieldId}`;
        tempSchema.push(Object.assign(genExtralSchemaOfField(id, PKField), { schemaType: 'TablePK', schemaId , schemaRef: `${schemaMark + schemaId}` }));
        pkSchemaRef.push(`${schemaMark + schemaId}`);
      }
    }
    if (type === InterMetaType.AUX_TABLE) {
      const FKField = fields.find(field => {
        const { fieldDataType } = field;
        return fieldDataType === FieldDataType.FK;
      });
      if (FKField) {
        const schemaId = `${id}_${FKField.fieldId}`;
        tempSchema.push(Object.assign(genExtralSchemaOfField(id, FKField), { schemaType: 'TableFK', schemaId , schemaRef: `${schemaMark + schemaId}` }));
        // pkSchemaRef.push(`${schemaMark + schemaId}`);
      }
    }
  });

};