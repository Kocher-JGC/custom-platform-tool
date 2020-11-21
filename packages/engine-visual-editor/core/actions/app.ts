/**
 * @author zxj
 *
 * 应用的 action，需要留有足够的扩展空间
 */

import { ActionsMeta, BasePageData, DSMeta, SchemaMeta, VarMeta } from "../../data-structure";

interface AppActionsContext {
  pageContent?: BasePageData
  payload?: any
  name?: string
  id?: string
}

export const INIT_APP = 'app/init';
export interface InitAppAction extends AppActionsContext {
  type: typeof INIT_APP
}

/**
 * 初始化应用数据
 */
export const InitApp = (actionPayload: AppActionsContext): InitAppAction => {
  return {
    type: INIT_APP,
    ...actionPayload
  };
};

export interface UpdateAppAction extends AppActionsContext {
  type: typeof UPDATE_APP
}
export const UPDATE_APP = 'app/update';
/**
 * 更新 app context 数据
 */
export const UpdateAppContext = (actionPayload: AppActionsContext): UpdateAppAction => {
  return {
    type: UPDATE_APP,
    ...actionPayload,
  };
};

export const UNMOUNT_APP = 'app/unmount';
export interface UnmountAppAction {
  type: typeof UNMOUNT_APP
}

/**
 * 初始化应用数据
 */
export const UnmountApp = (): UnmountAppAction => {
  return {
    type: UNMOUNT_APP,
  };
};

export const CHANGE_METADATA = 'app/change-metadata';

export interface ChangeMetadataOptionBasic<D> {
  /** 需要更改的 meta 的属性 */
  // metaAttr: keyof PageMetadata
  /** 更改 meta 后的数据 */
  data: D
  /** 依赖该 meta 的项的 id */
  relyID?: string
  /** 批量更新数据 */
  datas?: {
    [metaID: string]: D
  }
  /** 数据的引用 ID，如果不传，则创建一个新的 metaID */
  metaID?: string
  /** 需要删除的 meta 的 ID */
  rmMetaID?: string
  /** 是否直接替换整个 meta */
  replace?: boolean
}

export interface ChangeActionMetaOption extends ChangeMetadataOptionBasic<ActionsMeta> {
  metaAttr: 'actions'
}

export interface ChangeDSMetaOption extends ChangeMetadataOptionBasic<DSMeta> {
  metaAttr: 'dataSource'
}

export interface ChangeSchemaMetaOption extends ChangeMetadataOptionBasic<SchemaMeta> {
  metaAttr: 'schema'
}

export interface ChangeVarMetaOption extends ChangeMetadataOptionBasic<VarMeta> {
  metaAttr: 'varRely'
}

export type ChangeMetadataOption = ChangeActionMetaOption | 
ChangeDSMetaOption | 
ChangeVarMetaOption | 
ChangeSchemaMetaOption

export type ChangeMetadataOptions = ChangeMetadataOption | ChangeMetadataOption[]

export type ChangeMetadataAction = {
  type: typeof CHANGE_METADATA
  changeDatas: ChangeMetadataOption[]
}


/**
 * 初始化应用数据
 */
export const ChangePageMeta = (options: ChangeMetadataOptions): ChangeMetadataAction => {
  const changeDatas = Array.isArray(options) ? options : [options];
  return {
    type: CHANGE_METADATA,
    changeDatas
  };
};
