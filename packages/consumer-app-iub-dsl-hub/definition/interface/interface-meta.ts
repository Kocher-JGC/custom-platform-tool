
export enum InterfaceType {
  DICT_TABLE = 'DICT_TABLE',
  TREE_TABLE = 'TREE_TABLE',
  NORMAL_TABLE = 'NORMAL_TABLE',
}

export enum FieldType {
  STRING = 'STRING',
  INT = 'INT',
}

export enum FieldDataType {
  PK = 'PK',
  NORMAL = 'NORMAL',
  QUOTE = 'QUOTE',
  DICT = 'DICT',
}

export interface FieldMeta {
  id: string;
  fieldCode: string;
  fieldSize: number;
  fieldType: FieldType;
  fieldDataType: FieldDataType;
  name?: string;
}
export interface BaseInterfaceMeta {
  type: InterfaceType;
  id: string;
  code: string;
  name: string;
  fields: FieldMeta[];
}

export interface TreeInterfaceMeta extends BaseInterfaceMeta {
  type: InterfaceType.TREE_TABLE;
  maxLevel: number;
}

export type InterfaceMeta = TreeInterfaceMeta | BaseInterfaceMeta; 
