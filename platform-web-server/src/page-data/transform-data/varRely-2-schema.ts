import { Schema, ComplexType, FoundationType, SchemaItemDef } from "../types";
import { schemaMark, splitMark } from "./IUBDSL-mark";

/**
 * 将页面varRely数据转换成schema
 * @param varRely 页面varRely数据
 */
export const varRely2Schema = (varRely) => {
  const res: Schema= {};
  for (const key in varRely) {
    const rely = varRely[key];
    /** 删除var.引用 */
    const actualKey = key.replace(/^var\./, '');
    if (Array.isArray(rely?.varAttr) &&  rely.varAttr.length) {
      /**
       * 将varAttr生成 structObject
       */
      res[actualKey] = {
        type: ComplexType.structObject,
        schemaId: actualKey,
        desc: rely.title,
        schemaType: rely.type,
        schemaRef: schemaMark + actualKey,
        widgetRef: rely.widgetRef,
        struct: rely.varAttr?.reduce((r, obj, idx: number) => {
          if (obj) {
            const schemaId = obj.attr || idx;
            r[schemaId] = {
              schemaId,
              type: obj.type,
              desc: obj.alias,
              schemaRef: schemaMark + actualKey + splitMark + schemaId,
              defaultVal: rely.realVal,
            };
          }
          return r;
        }, {})
      };
    } else {
      res[actualKey] = {
        schemaId: actualKey,
        type: FoundationType.string,
        desc: rely.title,
        schemaRef: schemaMark + actualKey,
        schemaType: rely.type,
        widgetRef: rely.widgetRef,
        defaultVal: rely.realVal,
      };
    }
  }
  return res;
};
