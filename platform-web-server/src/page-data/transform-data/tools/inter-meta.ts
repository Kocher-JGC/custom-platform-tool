import { 
  GenInterMetaRes, InterRefRelation, FieldMeta,
  GetFieldsParam, FindRefRelationParam, InterMetaTools,
} from "@src/page-data/types";

const noopTrue = (...args: any[]) => true;
const defaultMap = (elm: any) => elm;

type AllFieldMeta = { [str: string]: FieldMeta }

export const interMetaToolInit = ({ interMetas, interRefRelations }: GenInterMetaRes): InterMetaTools => {
  const allFields: AllFieldMeta = interMetas.map(_ => _.fields).reduce((res, fields) => ({
    ...res,
    ...fields.reduce((r, field) => ({ ...r, [field.fieldId]: field }), {}),
  }), {});

  /**
   * 根据interIds或fieldIds查找引用关系
   * @param param0 查找关系得参数
   * @returns InterRefRelation[]
   */
  const findRefRelation = ({ inters, fields, refType }: FindRefRelationParam) => {
    /** 过滤type的函数 */
    const refTypeFilter = refType ? (type) => type === refType : (type) => true;
    /** 以后再合成 */
    const validTable = Array.isArray(inters)
      ? ((intersToUse: string[]) => (rR: InterRefRelation) => intersToUse.includes(rR.interId))(inters)
      : () => false;
    const validFields = Array.isArray(fields)
      ? ((fieldsToUse: string[]) => (rR: InterRefRelation) => fieldsToUse.includes(rR.fieldId))(fields) /** TODO: 这里无法确保为fieldsId */
      : () => false;
    const refRelationArr = interRefRelations.filter((rR: InterRefRelation) => (validTable(rR) || validFields(rR)) && refTypeFilter(rR.refType));
  
    return refRelationArr;
  };

  /**
   * 获取inter
   * @param inter inter的id或者code
   */
  const getInters = (inters: string[]) => {
    return interMetas.filter(({ id, code }) => inters.includes(id) || inters.includes(code));
  };
  
  /**
   * 获取interPK
   * @param inters inter的id或者code
   */
  const getIntersPK =(inters: string[]) => {
    return getInters(inters).map((_) => _.PKField);
  };

  /**
   * 获取单个字段信息
   * @param field 字段id // code未开发
   */
  const getField = (field: string) => {
    return allFields[field];
  };

  /**
   * 根据表或字段,获取并映射字段信息
   * 1. 过滤字段类型
   * 2. map 映射字段
   * @param param0 
   */
  const getFields = <T = FieldMeta>({ fields, inters, filter = noopTrue, map = defaultMap }: GetFieldsParam<T>) => {
    const fieldsRes: T[] = [];
    /** Array.flat() ?? 用不了? */
    if (Array.isArray(inters)) {
      getInters(inters).map((_) => _.fields).forEach(fieldsToUse => {
        fieldsRes.push(...fieldsToUse.filter(filter).map<T>(map));
      });
    }
    if (Array.isArray(fields)) {
      fieldsRes.push(...fields.map(getField).filter((_, ...args) => _ && filter(_, ...args)).map<T>(map));
    }

    return fieldsRes;
  };
  
  

  return {
    findRefRelation,
    getInters,
    getIntersPK,
    getField,
    getFields
  };
};
