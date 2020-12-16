
export const enum InterMetaType {
  /** 字典表 */
  DICT_TABLE = 'DICT_TABLE',
  /** 树形表 */
  TREE_TABLE = 'TREE_TABLE',
  /** 普通表 */
  NORMAL_TABLE = 'NORMAL_TABLE',
  /** 附属表 */
  AUX_TABLE = 'AUX_TABLE',
}

export const enum FieldType {
  /** (字符串) */
  STRING = 'STRING',  
  /** (整型) */
  INT = 'INT',  
  /** (时间) */
  TIME = 'TIME',  
  /** (日期) */
  DATE = 'DATE',  
  /** (日期时间) */
  DATE_TIME = 'DATE_TIME',  
  /** (超大文本) */
  TEXT = 'TEXT', 
}

export const enum FieldDataType {
  /** (系统字段) */
  SYS = 'SYS',
  /** (普通字段) */
  NORMAL = 'NORMAL', 
  /** (主键字段) */
  PK = 'PK', 
  /** (引用字段) */
  QUOTE = 'QUOTE', 
  /** (字典字段) */
  DICT = 'DICT', 
  /** (外键字段) */
  FK = 'FK', 
  /** (图片) */
  IMG = 'IMG', 
  /** (视频) */
  VIDEO = 'VIDEO', 
  /** (音频) */
  AUDIO = 'AUDIO', 
  /** (文件) */
  FILE = 'FILE',
}

export interface FieldMeta {
  fieldId: string;
  fieldCode: string;
  fieldSize: number;
  fieldType: FieldType;
  fieldDataType: FieldDataType;
  name?: string;
}
export interface BaseInterfaceMeta {
  type: InterMetaType;
  refId: string;
  id: string;
  code: string;
  name: string;
  /** 表格唯一物理主键 */
  PKField: FieldMeta;
  /** 表格业务复合主键, 暂未使用 */
  // withPK: FieldMeta[]
  fields: FieldMeta[];
}

export interface TreeInterfaceMeta extends BaseInterfaceMeta {
  type: InterMetaType.TREE_TABLE;
  maxLevel: number;
}

export type InterMeta = TreeInterfaceMeta | BaseInterfaceMeta; 
