export interface ConditionStrategyInput {
  type: 'input'
}

/**
 * 引用的选项数据源
 */
export interface ConditionStrategySelectorDSRef {
  type: 'ref'
  refID: string
}

/**
 * 指定的 options 作为数据源
 */
export interface ConditionStrategySelectorDSOptions {
  type: 'options'
  /** 作为数据源的 options */
  options?: ({
    value: any
    text: string
  })[]
}

export interface ConditionStrategySelector {
  type: 'selector'
  dataSource: ConditionStrategySelectorDSRef | ConditionStrategySelectorDSOptions
}

/**
 * 不展示该字段的查询条件
 */
export interface ConditionStrategyNone {
  type: 'none'
}

export type ConditionStrategy = ConditionStrategyNone | ConditionStrategyInput | ConditionStrategySelector

/**
 * 平台级别的表格的 column 数据结构抽象
 * TODO: 完善渲染策略
 */
export interface PTColumn {
  /** id */
  id: string
  /** 实际的对应数据库字段的显示名 */
  name: string
  /** 显示给用户看的 title */
  title: string
  /** 数据显示的 index */
  dataIndex: string
  /** 数据显示的别名 */
  alias: string
  /** 数据类型 */
  colDataType: string
  /** 字段 size */
  fieldSize: string
  /** 字段类型 */
  fieldType: string
  /** 字段的名字 */
  fieldCode: string
  /** 
   * 行数据渲染策略，方案未定
   * TODO: 确定渲染策略
   */
  rowRenderStrategy: {

  }
  /**
   * 列作为查询条件的渲染策略
   */
  conditionStrategy: ConditionStrategy
}
