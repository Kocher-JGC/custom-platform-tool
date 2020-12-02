export const enum TableType {
  TABLE = 'TABLE', // (普通表) 
  TREE = 'TREE', // (树形表) 
  AUX_TABLE = 'AUX_TABLE', // (附属表)
  DICT = 'DICT',
}

export const enum Species {
  SYS = 'SYS', // (系统元数据)   
  // 用户填写的表默认BIS即可
  BIS = 'BIS', // (业务元数据) 
  SYS_TMPL = 'SYS_TMPL', // (系统元数据,允许修改) 
  BIS_TMPL = 'BIS_TMPL', // (业务元数据,禁止删除)， 
}

const enum RelationType {
  ONE_TO_ONE = 'ONE_TO_ONE', // (一对一) 
  MANY_TO_ONE = 'MANY_TO_ONE', // (一对多)
}

/** 字典 */
export interface RemoteDict {
  /** 主键 */
  id:	string;
  /** 创建人 */
  createdBy:	string;
  /** 创建时间 */
  gmtCreate:	string;
  /** 修改人 */
  modifiedBy:	string;
  /** 修改时间 */
  gmtModified:	string;
  /** 字典名称  */
  name:	string;
  /** 描述 */
  description:	string;
  /** 字典项集合 */
  items:	RemoteDictItem[];
  
}

/** 字典每一项 */
export interface RemoteDictItem {
  /** 主键 */
  id: string; 
  /** 创建人 */
  createdBy: string; 
  /** 创建时间 */
  gmtCreate: string; 
  /** 修改人 */
  modifiedBy: string; 
  /** 创建时间 */
  gmtModified: string; 
  /** 字典项编码 */
  code: string; 
  /** 字典项名称 */
  name: string; 
  /** 父级字典项 */
  pid: string; 
  /** 背景颜色 */
  renderBgColor: string; 
  /** 字体颜色 */
  renderFontColor: string; 
  /** 排序号 */
  sort: number; 
  /** 层级 */
  level: number; 
  /** 路径 */
  path: string; 
  /** 是否含有子项，true有false没有 */
  hasChild: boolean; 

}

/** 表 */
export interface RemoteTable {
  /** (表主键 */	
  id: string;
  /** 创建时间 */
  gmtCreate: string;
  /** 修改人 */
  modifiedBy: string;
  /** 修改时间 */
  gmtModified: string;
  /** 数据表名称 */
  name: string;
  /** 数据表编码 */
  code: string;
  /** 表类型 */ 
  type: TableType;

  /** 归属模块，对应菜单模块主键 */
  moduleId: string
  /** 归属模块名称 */
  moduleName: string
  /** 	业务字段类型， */ 
  species: Species;
  /** 备注 */
  description: string;
  /** 附属表对象 */
  auxTable: RemoteAuxTable
  /** 树型表对象 */
  treeTable: RemoteTreeTable
  /** 引用表对象集合 */
  references: TableReferenceConfig[];
  /** 外键对象集合 */	
  foreignKeys: ForeignKeyConfig[];
  /** 关联页面信息 */
  relationTables: RelationTable[];
  /** 列对象集合 */
  columns: RemoteTableColumn[]
}

interface RemoteAuxTable {

  /** 主表表名 */
  mainTableCode: string;
  /** 关联关系 */
  relationType: RelationType;
  /** 主表信息 */
  parentTable: RemoteTable;
}

interface RemoteTreeTable {
  maxLevel: number; //	int	最大层级数
}

interface TableColRefBaseConf {
  /** 引用主键 */
  id: string;
  /** 字段主键 */
  fieldId: string;
  /** 字段编码 */ 
  fieldCode: string;
  /** 字段名称 */ 
  fieldName: string;
  /** 关联表主键 */
  refTableId: string;
  /** 关联表 */ 
  refTableCode: string;
  /** 关联字段 */ 
  refFieldCode: string;
  /** 关联字段id */
  refFieldId: string;
  /** 关联字段类型 */ 
  refFieldType: string;
  /** 关联字段长度 */ 
  refFieldSize: number;
  /** 关联字段显示字段id */
  refDisplayFieldId: string;
  /** 关联字段显示字段Code */ 
  refDisplayFieldCode: string;
  /** 排序号 */ 
  sequence: number;
  /** 业务字段类型 */ 
  species: Species;
}

type TableReferenceConfig = TableColRefBaseConf;

interface ForeignKeyConfig extends TableColRefBaseConf {
  deleteStrategy: string;
  /** 外键约束（更新时） */ 
  updateStrategy: string;
}

interface RelationTable {
  id: string; // (long)	页面主键
  name: string; // 	页面名称
}

export interface RemoteTableColumn {
  /** 列主键 */
  id: string; 
  /** 字段名称 */
  name: string; 
  /** 	字段编码 */
  code: string; 
  /** 	字段类型 */
  fieldType: string; 
  /** 字段长度 */
  fieldSize: number; 
  /** 数据类型 */
  dataType: string;
  species: Species;
  decimalSize: number;
  /** 属性对象,key为列的页面属性, value为对应的属性值 */
  fieldProperty: FieldProperty;
  dictionaryForeign: DictionaryForeign
}

interface DictionaryForeign {
  /** 字典主键 */
  id: string; 
  /** 表名 */
  tableName: string; 
  /** 字段主键 */
  fieldId: string; 
  /** 字典字段 */
  fieldCode: string; 
  /** 关联表主键 */
  refTableId: string; 
  /** 字典保存字段表中文名 */
  refTableName: string; 
  /** 字典保存字段,写死code值 */
  refFieldCode: string; 
  /** 字典显示字段,写死name值 */
  refDisplayFieldCode: string; 
  /** 业务字段类型 */
  species: Species; 
}

interface FieldProperty {
  required: boolean; //	必填,值true是，false否
  unique: boolean; //	唯一,值true是，false否
  pinyinConvent: boolean; //	装换成拼音,值true是，false否
  regular: any; //	校验规则
}