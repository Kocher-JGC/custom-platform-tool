import { LayoutInfoActionReducerState } from "./layout";
import { WidgetRelyPropItems } from "./widget";

/**
 * 变量 item 的类型
 */
export interface VarAttrType {
  /** 该属性变量的别名 */
  alias: string
  /** 该属性变量的别名 */
  attr: string
  /** 变量类型 */
  type: 'string' | 'number'
}

export interface EventAttrType {
  /** 该事件变量的别名 */
  alias: string
  /** 事件类型 */
  type: 'onClick'|'onDbClick'
}

/**
 * 依赖控件的变量
 */
export interface WidgetVarRely {
  /** 组件类型的变量 */
  type: 'widget'
  /** 依赖的控件的 ID */
  widgetRef: string
  /** 变量存储的实体 */
  varAttr: VarAttrType[]
}

/**
 * 依赖数据源的变量
 */
export interface DSVarRely {
  type: 'ds'
  varAttr: any
}

/**
 * 输入参数变量
 */
export interface PageInputVarRely {
  type: 'pageInput'
  /** 变量描述信息 */
  alias?: string
  /** 变量值 */
  realVal?: string|number
  /** 变量数据类型 */
  varType: string
  /** 变量编码，由配置人员定义 */
  code: string
  /** 变量名称：由配置人员定义 */
  title: string
}

export interface MetaStorage<D = any> {
  [metaID: string]: D
}

export interface SchemaMeta {
  column
  tableInfo
}

/**
 * TODO: 完善数据类型
 */
export interface ActionsMeta {
}
/**
 * TODO: 事件类型
 */
export interface EventsMeta {

}
export type VarMeta = WidgetVarRely | DSVarRely

export type DSMeta = PD.Datasources

/**
 * 页面的元数据
 */
export interface PageMetadata {
  /** 记录 widget 的数量 */
  widgetCounter: number
  /** 页面标准接口 */
  pageInterface: MetaStorage
  /** 联动 meta */
  linkpage: MetaStorage
  /** 记录数据源 */
  dataSource: MetaStorage<DSMeta>
  /** 用于存储页面的表单的数据模型 */
  schema: MetaStorage<SchemaMeta>
  /** 动作 meta */
  actions: MetaStorage<ActionsMeta>
  /** 变量 meta */
  varRely: MetaStorage<VarMeta>
  /** meta 依赖收集器，用于记录每一条 meta 被依赖的情况 */
  _rely: {
    [metaID: string]: string[]
  }
  /** 事件 meta */
  events: MetaStorage<EventsMeta>
}

/**
 * 基础页面数据
 */
export interface BasePageData {
  /** ID */
  id: string
  /** ID */
  pageID: string
  /** 页面名字 */
  name: string
  /** 页面布局内容 */
  content: LayoutInfoActionReducerState
  /** 页面元数据，包括联动、表达式、以及大部分的业务扩展 */
  meta: PageMetadata
}

/**
 * 页面元数据
 */
export interface PageStageEntity {
  /** 内部 page id，一般为固定 id */
  id: string
  /** 存放后端返回的 page id */
  pageID: string
  /** 绑定可编辑的属性 */
  propItemsRely: WidgetRelyPropItems
}
