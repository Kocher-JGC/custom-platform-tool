/**
 * @author zxj
 * 在画布中的 actions
 */

import { ElemNestingInfo } from "@engine/layout-renderer";
import {
  TempWidgetEntityType,
  WidgetEntity,
} from "../../data-structure";

/**
 * 添加组件实例
 */
export const ADD_TEMP_ENTITY = 'entity/temp/add';
export interface AddTempEntityAction {
  type: typeof ADD_TEMP_ENTITY
  entity: TempWidgetEntityType
  nestingInfo: ElemNestingInfo
}

export const AddTempEntity = (
  entity: TempWidgetEntityType,
  options: AddEntityOptions
): AddTempEntityAction => {
  return {
    type: ADD_TEMP_ENTITY,
    entity,
    ...options
  };
};

/**
 * 添加组件实例
 */
export const ADD_ENTITY = 'entity/add';
export interface AddEntityAction {
  type: typeof ADD_ENTITY
  entity: WidgetEntity
  nestingInfo: ElemNestingInfo
}

interface AddEntityOptions {
  nestingInfo: ElemNestingInfo
}

export const AddEntity = (
  entity: WidgetEntity,
  options: AddEntityOptions
): AddEntityAction => {
  return {
    type: ADD_ENTITY,
    entity,
    ...options
  };
};

/**
 * 删除组件实例
 */
export const DEL_ENTITY = 'entity/del';
export interface DelEntityAction {
  type: typeof DEL_ENTITY
  nestingInfo: ElemNestingInfo
  entity: WidgetEntity
}

export const DelEntity = (
  nestingInfo: ElemNestingInfo,
  entity
): DelEntityAction => {
  return {
    type: DEL_ENTITY,
    entity,
    nestingInfo
  };
};

/**
 * ElemNestingInfo
 * 记录嵌套信息
 *
 * 例如 [0] 代表最外层的第 0 个元素中进行排序
 * 例如 [0, 1, 2] 代表最外层第 0 个元素中的第 1 个元素中的第 2 个元素
 */

type SortingActionType = 'swap' | 'put'

interface SortingActionSwap {
  type: 'swap'
  sourceItemNestIdx: ElemNestingInfo
  swapItemNestIdx: ElemNestingInfo
}

interface SortingActionPut {
  /** 将元素推入到 */
  type: 'put'
  /** 推入的容器 item 的 idx */
  putItemNestIdx: ElemNestingInfo
  /** 源 item 的 idx */
  sourceItemNestIdx: ElemNestingInfo
  /** 将要推入到 putItemNestIdx 的第几个 */
  putIdx: number
}
/**
 * 设置 layout info 的值
 */
export const SORTING_ENTITY = 'entity/sorting';
export interface SortingEntityAction {
  type: typeof SORTING_ENTITY
  sortOptions: SortingActionSwap | SortingActionPut
}
// export interface SortingEntityAction {
//   type: typeof SORTING_ENTITY
//   /** 拖动的元素的 index */
//   dragItemNestIdx: ElemNestingInfo
//   /** 拖动的元素移动到了的 index */
//   hoverItemNestIdx: ElemNestingInfo
//   entity?
//   /** 是否交换 */
//   actionType: SortingActionType
// }

export const SortingEntity = (
  sortOptions: SortingActionSwap | SortingActionPut
  // /** 拖起的项的 index */
  // dragItemNestIdx: ElemNestingInfo,
  // /** 拖起的项移动到的 index */
  // hoverItemNestIdx: ElemNestingInfo,
  // /** 选项 */
  // options: {
  //   /** 拖起的 entity */
  //   entity?
  //   /** 
  //    * 排序的元素和另一个元素的交互类型
  //    * 1. swap 交换两个元素的位置
  //    * 2. put 将 dragItemNestIdx 嵌入到 hoverItemNestIdx 中
  //    */
  //   actionType: SortingActionType
  // },
): SortingEntityAction => {
  // const { actionType } = options;
  return {
    type: SORTING_ENTITY,
    sortOptions
  };
};

/**
 * 设置 layout info 的值
 */
export const SET_LAYOUT_STATE = 'layout/state/set';
export interface SetLayoutAction {
  type: typeof SET_LAYOUT_STATE
  state
}

export const SetLayoutInfo = (
  state
): SetLayoutAction => {
  return {
    type: SET_LAYOUT_STATE,
    state
  };
};

/// entity /////////////////

/**
 * 初始化组件类的状态
 */
export const UNSELECT_ENTITY = 'entity/unselect';
export interface UnselectEntityAction {
  type: typeof UNSELECT_ENTITY
}

export const UnselectEntity = (
): UnselectEntityAction => {
  return {
    type: UNSELECT_ENTITY,
  };
};

/**
 * 选择组件实例
 */
export const SELECT_ENTITY = 'entity/select';
export interface SelectEntityAction {
  type: typeof SELECT_ENTITY
  entity: WidgetEntity
  nestingInfo: ElemNestingInfo
}

export const SelectEntity = (
  entity: WidgetEntity,
  nestingInfo
): SelectEntityAction => {
  return {
    type: SELECT_ENTITY,
    entity,
    nestingInfo
  };
};
