
import { PageMetadata } from "./page-metadata";

type MetaAttr = keyof PageMetadata

export interface NextEntityState {
  /** 目标属性 */
  attr: string
  /** 属性的值 */
  value: any
}

export type NextEntityStateType = NextEntityState | NextEntityState[]

export type ChangeEntityState = (nextEntityState: NextEntityStateType) => void

export interface TakeMetaOptions {
  /** meta 的 attr */
  metaAttr: MetaAttr
  /** meta 的引用 ID */
  metaRefID?: string
}

export type TakeMeta = (options: TakeMetaOptions) => unknown

export type GenMetaRefID = (
  /** 编辑的 meta 属性 */
  metaAttr: MetaAttr,
  /** 生成的 options */
  options?: {
    /** 生成的 metaID */
    len?: number
    /** 额外的 meta id 信息 */
    extraInfo?: string
    /** 数据源的 ID，当 metaAttr = dataSource 时必填；TODO: 做 metaAttr = dataSource 时必填的检查 */
    dsID?: string
  }
) => string

