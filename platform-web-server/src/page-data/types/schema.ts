export const enum ComplexType {
  structArray = 'structArray',
  structObject = 'structObject',
}
export const enum FoundationType {
  number = 'number',
  string = 'string',
  boolean = 'boolean'
}

export const enum SchemaType {
  pageInput = 'pageInput',
  widget = 'widget',
  interPK = 'interPK',
  interFK = 'interFK',
  widgetTable = 'widgetTable',
}

interface BaseScheamDef {
  // rules?: Rule[]; // 规则也应该是属于关系的扩展来的,因为他是有多方的依赖
  // group?: string[]; // 是关系使用模型仓库,关系依赖他.. 所以放在关系上扩展
  // inputDataWeight?: unknown[]; // 多个来源的值共同作用于同一个模型

  /** 默认值: 组件的默认值, 应该会给到schema, 这个如何处理? */
  defaultVal?: string | number | boolean;
  type: FoundationType | ComplexType;
  schemaId: string;
  /** 使用schema的引用路径 */
  schemaRef: string;
  /** schema来源的类型 / 变量类型 */
  schemaType?: SchemaType;
  /** widget 引用Id */
  widgetRef?: string;

  /** 对应接口id「复合对象可以仅对应inerId」 */
  interId?: string;
  /** 对应字段id */
  fieldId?: string;
  /** schema的描述 */
  desc?: string;
}
export interface FoundationTypeSchemas extends BaseScheamDef {
  type: FoundationType
}

export interface ComplexTypeSchemas extends BaseScheamDef {
  type: ComplexType;
  struct: {
    [UUID: string]: SchemaItemDef
  }
}

export type SchemaItemDef = FoundationTypeSchemas | ComplexTypeSchemas

export interface Schema {
  [dataUUID: string]: SchemaItemDef;
}