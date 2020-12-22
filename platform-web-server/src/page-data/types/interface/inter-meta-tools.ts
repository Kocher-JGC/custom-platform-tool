import { RefType, FieldMeta, InterRefRelation, InterMeta } from "@src/page-data/types";

interface BaseFindParam {
  /** 表ID */
  inters?: string[];
  /** 字段id */
  fields?: string[];
}

export interface FindRefRelationParam extends BaseFindParam {
  refType?: RefType
}

export interface GetFieldsParam<T> extends BaseFindParam {
  filter?:(elm: FieldMeta, idx: number, origin: FieldMeta[]) => boolean
  map?: (elm: FieldMeta, idx: number, origin: FieldMeta[]) => T;
}

export interface InterMetaTools {
  findRefRelation: ({ inters, fields, refType }: FindRefRelationParam) => InterRefRelation[];
  getInters: (inters: string[]) => InterMeta[];
  getIntersPK: (inters: string[]) => FieldMeta[];
  getField: (field: string) => FieldMeta;
  getFields: <T = FieldMeta>({ fields, inters, filter, map }: GetFieldsParam<T>) => T[];
  getFieldAndInterInfo: ({ field, inter }: { field: string, inter: string }) => { interInfo: InterMeta, fieldInfo: FieldMeta } | null;
}
