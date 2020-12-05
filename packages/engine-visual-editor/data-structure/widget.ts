/// //////////////// widget ///////////////////
// import { PropItemCompAccessSpec } from ".";

import { TEMP_ENTITY_ID } from "../core";
import { VarAttrType, EventAttrType } from "./page-metadata";
import { WidgetRelyPropItems } from "./widget-prop-item-rely";

/**
 * 1. 可被编辑属性的组件的定义
 * 2. 用于存储组件的元数据信息
 */
export interface EditableWidgetMeta<G = string> {
  /** 组件类型 id */
  id: string
  /** 组件类面板的显示名 */
  label: string;
  /** 组件类面板的显示名 */
  desc?: string;
  /** widget 的分组信息 */
  wGroupType?: G
  /** 绑定可编辑的属性 */
  propItemsRely: WidgetRelyPropItems
  /** 引用定义了的组件，对应组件的 name */
  widgetRef: string
  /** 可以提升为变量的属性的集合 */
  varAttr?: VarAttrType[]
  /**
   * 自定义编辑器，规则：
   * 1. 必须已经在开发项中开发
   * 2. 通过字符串找到对应的自定义编辑器
   */
  propEditor?: string
  eventAttr?: EventAttrType[]
}

/// //////////////// widget entity ///////////////////

/**
 * 组件实例信息
 */
export interface WidgetEntity extends EditableWidgetMeta {
  /** 实例 id */
  id: string
  /** 子元素 */
  body?: WidgetEntity[]
  /** 存储组件实例的状态 */
  propState?: WidgetEntityState
  /** 实例化后的状态 */
  _state: string
  // _state: 'active' | 'disable'
}

/**
 * 组件实例状态
 */
export interface WidgetEntityState {
  value?: any
}

/// //////////////// temp widget entity 临时组件实例 ///////////////////

/**
 * 由于拖动产生的临时 entity
 */
export interface TempWidgetEntityType {
  id: string
  /** 标志性为临时实例 */
  _state: typeof TEMP_ENTITY_ID
}

/**
 * 组件类集合
 */
export interface WidgetTypeMetadataCollection {
  [id: string]: EditableWidgetMeta
}
