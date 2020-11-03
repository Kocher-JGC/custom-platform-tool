/// //////////////// widget ///////////////////
import { CustomEditor } from "@engine/visual-editor/spec/custom-editor";

import { PropItemCompAccessSpec } from ".";

export type EditAttr = string | string[]

/**
 * 组件引用属性项的配置项
 */
export interface PropItemRefs {
  /** 引用的属性项的 id */
  propID: string
  /**
   * 1. 该属性项编辑的属性
   * 2. 可以覆盖由属性项元数据中声明的 whichAttr 属性
   * 3. 如果不填，默认可以修改全部属性
   */
  editAttr: EditAttr
  /** 覆盖属性项定义的默认值 */
  defaultValues?: {
    [editAttr: string]: any
  }
}

/**
 * widget 绑定的属性
 */
export interface WidgetRelyPropItems {
  /** 绑定的属性项 */
  propItemRefs?: PropItemRefs[]
  /** 原生属性配置 */
  rawPropItems?: PropItemCompAccessSpec[]
}

/**
 * 1. 可被编辑属性的组件的定义
 * 2. 用于存储组件的元数据信息
 */
export interface EditableWidgetMeta {
  /** 组件类型 id */
  id: string
  /** 组件类面板的显示名 */
  label: string;
  /** 组件类面板的显示名 */
  desc?: string;
  /** 绑定可编辑的属性 */
  propItemsRely: WidgetRelyPropItems
  /** 引用定义了的组件，对应组件的 name */
  widgetRef: string
  /** 可以提升为变量的属性的集合 */
  varAttr?: string[] | string | 'all'
  /** 自定义编辑器 */
  propEditor?: CustomEditor
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

export const TEMP_ENTITY_ID = 'temp-entity';
/**
 * 由于拖动产生的临时 entity
 */
export interface TempWidgetEntityType {
  id: string
  /** 标志性为临时实例 */
  _state: typeof TEMP_ENTITY_ID
}
