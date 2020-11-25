export enum RefType {
  DICT = 'DICT',
  QUOTE = 'QUOTE',
}

/**
 * 接口引用关系的描述
 */
export interface InterfaceRefRelation {
  refType: RefType;
  /** 接口引用关系的id「默认等于interId/fieldId」 */
  refId: string; // 1330690108524994560/1330692953483649025
  /** ---------------------------------- */
  /** 接口id */
  interId: string;  
  /** 接口Code标识 */
  interCode: string; // location
  /** 引用字段的id */
  fieldId: string;
  /** 引用字段的code标识 */
  fieldCode: string;
  /** ---------------------------------- */
  /** 被引用接口的id */
  refInterId: string;
  /** 被引用接口code标识 */
  refInterCode: string;
  /** 被引用接口的字段id */
  refFieldId: string;
  /** 被引用接口的字段code标识 */
  refFieldCode: string;
}