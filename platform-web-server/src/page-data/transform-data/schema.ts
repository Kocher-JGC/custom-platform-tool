import { 
  InterMeta, TransfromCtx, FieldDataType,
  InterMetaType, FieldMeta, SchemaItemDef,
  FoundationType, SchemaType
} from "../types";
import { schemaMark } from "./IUBDSL-mark";

const genExtralSchemaOfField = (interId: string, field: FieldMeta): SchemaItemDef => {
  return {
    schemaId: '',
    interId,
    fieldId: field.fieldId,
    type: FoundationType.string,
    desc: field.name,
    schemaRef: '',
    schemaType: SchemaType.interPK,
    defaultVal: '$ID()',
  };
};

/**
 * 生成额外的接口元数据的schema
 * @param transfromCtx 转换上下文
 * @param interMetas 所有接口元数据
 */
export const genExtralSchemaOfInterPK = (transfromCtx: TransfromCtx, interMetas: InterMeta[]) => {
  const { extralDsl: { tempSchema }, pkSchemaRef } = transfromCtx;

  interMetas.forEach(({ fields, type, code, id, PKField  }) => {
    /** 非字典表生成额外的IDschema */
    if (type !== InterMetaType.DICT_TABLE) {
      const schemaId = `${id}_${PKField.fieldId}`;
      tempSchema.push(Object.assign(genExtralSchemaOfField(id, PKField), { schemaId , schemaRef: `${schemaMark + schemaId}` }));
      pkSchemaRef.push(`${schemaMark + schemaId}`);
    }
    if (type === InterMetaType.AUX_TABLE) {
      const FKField = fields.find(field => {
        const { fieldDataType } = field;
        return fieldDataType === FieldDataType.FK;
      });
      if (FKField) {
        const schemaId = `${id}_${FKField.fieldId}`;
        tempSchema.push(Object.assign(genExtralSchemaOfField(id, FKField), { schemaType: SchemaType.interFK, schemaId , schemaRef: `${schemaMark + schemaId}` }));
        // pkSchemaRef.push(`${schemaMark + schemaId}`);
      }
    }
  });

};