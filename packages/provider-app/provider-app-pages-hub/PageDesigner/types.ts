/**
 * 定义属性项可以改动的属性
 */
export type Species = 'SYS' | 'BIS' | 'SYS_TMPL' | 'BIS_TMPL'
export interface TableColumnItem {
  id: string
  name: string
  /** 数据类型 */
  colDataType: string
  /** 字段 size */
  fieldSize: string
  /** 字段类型 */
  fieldType: string
  /** 字段的名字 */
  fieldCode: string
  /** 字段的种类：系统元数据，业务元数据 */
  species: Species
  /** 对应的数据源唯一标识 */
  dsID: string
}
export type BasicDatasourceItem = {
  /** 该条记录的 id */
  id: string
  /** code */
  code: string
  /** 名字 */
  name: string
}

export type TableDatasourceItem = BasicDatasourceItem & {
  /** 该条记录关联的表的 id */
  moduleId: string
  type: 'TABLE'
  tableType: 'TABLE'|'AUX_TABLE'
  columns: {[key:string]:TableColumnItem}
}
export type DictColumnItem = {dsID: string, id: string, name: string, code: string}
export type DictDatasourceItem = BasicDatasourceItem & {
  type: 'DICT'
  columns: {[key:string]: DictColumnItem}
}
export type DatasourceItem = (TableDatasourceItem | DictDatasourceItem )
export type DatasourceItemInMeta = DatasourceItem & {createdBy: 'page'|'prop'}

export interface PDPropItemRendererBusinessPayload {
  /** 内部的已绑定的数据源 */
  interDatasources: PD.Datasources
  /** 提供给属性项的请求服务 */
  $services: {
    /** 字典 */
    dict: {
      /** 获取字典 */
      getDictList: Promise<unknown>
      /** 获取字典的子项 */
      getDictWithSubItems: Promise<unknown>
    }
    /** 表格 */
    table: {
      /** 获取表格 */
      getTable: Promise<unknown>
    }
  }
}

export type DatasourceGroup = DatasourceItem[]
export type DatasourceInMetaGroup = {[key:string]:DatasourceItemInMeta}

/** PageDesigner */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PD {
  export type TableColumn = TableColumnItem
  export type TableDatasouce = TableDatasourceItem
  export type Datasource = DatasourceItem
  export type DatasourceInMeta = DatasourceItemInMeta
  export type Datasources = DatasourceGroup
  export type DatasourcesInMeta = DatasourceInMetaGroup
  /** 属性项的业务承载 */
  export type PropItemRendererBusinessPayload = PDPropItemRendererBusinessPayload
}
/** 页面设计器的类型定义 */
