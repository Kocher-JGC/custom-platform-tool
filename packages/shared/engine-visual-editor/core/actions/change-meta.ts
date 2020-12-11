import { ActionsMeta, DSMeta, SchemaMeta, VarMeta } from "../../data-structure";

// export enum TypeofMetaChanger {
export const TypeofMetaChangerCreate = 'create';
export const TypeofMetaChangerReplace = 'replace';
export const TypeofMetaChangerUpdate = 'update';
export const TypeofMetaChangerUpdateBatch = 'update/batch';
export const TypeofMetaChangerRM = 'rm';
export const TypeofMetaChangerRMAdd = 'create&rm';
// }

export interface CreateMeta<D> {
  type: typeof TypeofMetaChangerCreate
  /** 依赖该 meta 的项的 id */
  relyID?: string
  metaID: string
  data: D
}
export interface ReplaceMeta<D> {
  type: typeof TypeofMetaChangerReplace
  datas: {
    [metaID: string]: D
  }
}

export interface UpdateMeta<D> {
  type: typeof TypeofMetaChangerUpdate
  /** 依赖该 meta 的项的 id */
  relyID?: string
  metaID: string
  data: D
}

export interface UpdateMetaBatch<D> {
  type: typeof TypeofMetaChangerUpdateBatch
  datas?: {
    [metaID: string]: D
  }
}

export interface RmMeta {
  type: typeof TypeofMetaChangerRM
  rmMetaID: string
}

export interface RmAndAddMeta<D> extends Omit<CreateMeta<D>, 'type'> {
  type: typeof TypeofMetaChangerRMAdd
  rmMetaID: string
}

export type ModifyMetaTypes<D> = RmMeta | CreateMeta<D> | UpdateMeta<D> | UpdateMetaBatch<D> | ReplaceMeta<D>  | RmAndAddMeta<D>

export type ChangeMetadataOptionBasic<D, M> = {
  metaAttr: M
} & ModifyMetaTypes<D>
// {
//   /** 需要更改的 meta 的属性 */
//   // metaAttr: keyof PageMetadata
//   /** 更改 meta 后的数据 */
//   // data: D
//   // /** 依赖该 meta 的项的 id */
//   // relyID?: string
//   // /** 批量更新数据 */
//   // datas?: {
//   //   [metaID: string]: D
//   // }
//   // /** 数据的引用 ID，如果不传，则创建一个新的 metaID */
//   // metaID?: string
//   // /** 需要删除的 meta 的 ID */
//   // rmMetaID?: string
//   // /** 是否直接采用传入的 datas 替换整个 meta */
//   // replace?: boolean
// }

export type ChangeActionMetaOption = ChangeMetadataOptionBasic<ActionsMeta, 'actions'>
//  {
//   metaAttr: 'actions'
// }

export type ChangeDSMetaOption = ChangeMetadataOptionBasic<DSMeta, 'dataSource'> 
// {
//   metaAttr: 'dataSource'
// }

export type ChangeSchemaMetaOption = ChangeMetadataOptionBasic<SchemaMeta, 'schema'> 
// {
//   metaAttr: 'schema'
// }

export type ChangeVarMetaOption = ChangeMetadataOptionBasic<VarMeta, 'varRely'> 
// {
//   metaAttr: 'varRely'
// }

export type ChangeEventMetaOption = ChangeMetadataOptionBasic<VarMeta, 'events'> 
// {
//   metaAttr: 'events'
// }

export type ChangeMetadataOption = ChangeEventMetaOption | ChangeActionMetaOption | ChangeDSMetaOption | ChangeVarMetaOption | ChangeSchemaMetaOption 

export type ChangeMetadataOptions = ChangeMetadataOption | ChangeMetadataOption[]
