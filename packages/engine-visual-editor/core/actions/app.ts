/**
 * @author zxj
 *
 * 应用的 action，需要留有足够的扩展空间
 */

import { BasePageData, PageMetadata } from "../../data-structure";

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

export interface ChangeMetadataOptions {
  /** 需要更改的 meta 的属性 */
  metaAttr: keyof PageMetadata
  /** 更改 meta 后的数据 */
  data: unknown
  /** 批量更新数据 */
  datas?: {
    [dataID: string]: unknown
  }
  /** 数据的引用 ID，如果不传，则创建一个新的 metaID */
  metaID?: string
  /** 需要删除的 meta 的 ID */
  rmMetaID?: string
  /** 是否直接替换整个 meta */
  replace?: boolean
}

export interface ChangeMetadataAction extends ChangeMetadataOptions {
  type: typeof CHANGE_METADATA
}

/**
 * 初始化应用数据
 */
export const ChangeMetadata = (options: ChangeMetadataOptions): ChangeMetadataAction => {
  return {
    type: CHANGE_METADATA,
    ...options
  };
};
