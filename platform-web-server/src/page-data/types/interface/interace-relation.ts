export const enum RefType {
  /** (引用字段) 实际一种引用 */
  QUOTE = 'QUOTE', 
  /** (字典字段) */
  DICT_Q = 'DICT_Q', 
  /** (外键字段) */
  FK_Q = 'FK_Q',
  /** 树形引用 */
  TREE_Q = 'TREE_Q',
}

export const enum RelationType {
  /** (一对一) */
  ONE_TO_ONE = 'ONE_TO_ONE', 
  /** (一对多) */
  MANY_TO_ONE = 'MANY_TO_ONE',
}

/**
 * 接口引用关系的描述 「确保数据的准确性和完整性」
 * 1. 新增/修改 是新增/修改引用关系
 *   1). 新增， 附属表需要把外键引用关系建立 「(*^__^*)」
 *   2). id， 引用因为存储的实际值就是id的引用
 * 2. 查询 「需要查什么内容， 确保内容的准确和完整性」
 *   1). 确保准确性： 进行连表拼接的、1+1的额外操作 「(*^__^*)」
 *   2). 通过标示进行读写数据， 可以弱化引用关系 「(*^__^*)」
 * 3. 删除
 *   1). 需要把相关的引用或信息都干掉「后端完成」
 */
export interface InterRefRelation {
  refType: RefType;
  /** 正向引用仅有一对一, 反向有一对多 */
  relationType: RelationType;
  /** 接口引用关系的id「默认等于interId/fieldId」 */
  refId: string; // 1330690108524994560/1330692953483649025
  /** ---------------------------------- */
  /** 接口id */
  interId: string;  
  /** 接口Code标识 */
  interCode: string;
  /** 接口字段的ID标识 */
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
  /** 关联字段显示字段Code */ 
  refShowFieldCode: string;
  /** 关联字段显示字段id */
  refShowFieldId: string;
}