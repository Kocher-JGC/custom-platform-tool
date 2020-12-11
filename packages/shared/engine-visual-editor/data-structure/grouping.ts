/**
 * 组件的分组信息
 */
export interface WidgetGrouping {
  /** 组的标题 */
  title: string
  /** 组的类型 */
  type?: string
  itemsGroups: ({
    title: string
    type: string
    items: string[]
  })[]
}

/**
 * 属性项的分组信息
 */
export interface PropItemGrouping {
  /** 组的标题 */
  title: string
  /** 组的类型 */
  type?: string
  itemsGroups: ({
    title: string
    type: string
    items: string[]
  })[]
}