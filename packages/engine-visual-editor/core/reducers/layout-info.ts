import update from 'immutability-helper';
import produce from 'immer';
import flattenDeep from 'lodash/flattenDeep';
import { LayoutInfoActionReducerState, FlatLayoutItems } from "../../data-structure";
import {
  ADD_ENTITY, SET_LAYOUT_STATE, DEL_ENTITY,
  AddEntityAction, DelEntityAction, SetLayoutAction,
  SortingEntityAction,
  SORTING_ENTITY,
  UPDATE_ENTITY_STATE,
  UpdateEntityStateAction,
  InitEntityStateAction,
  INIT_ENTITY_STATE,
  INIT_APP,
  InitAppAction,
  CHANGE_ENTITY_TYPE,
  ChangeEntityTypeAction
} from '../actions';
import { getItemFromNestingItemsByBody } from '../utils';
import { mergeDeep } from '@infra/utils/tools';
import { ElemNestingInfo } from '@engine/layout-renderer';

/**
 * action types
 */
export type LayoutInfoActionReducerAction =
  AddEntityAction |
  DelEntityAction |
  SetLayoutAction |
  SortingEntityAction |
  UpdateEntityStateAction |
  InitEntityStateAction |
  ChangeEntityTypeAction |
  InitAppAction

function addItem2NestingArr(array: any[], nestingInfo: ElemNestingInfo, addItem) {
  const _nestingInfo = [...nestingInfo];
  const targetAddPosition = _nestingInfo.pop() as number;
  if(_nestingInfo.length === 0) {
    array.splice(targetAddPosition, 1, addItem);
  } else {
    const recursive = (currDiveIdx) => {
      const currNestIdx = _nestingInfo[currDiveIdx];
      const nextNestIdx = _nestingInfo[currDiveIdx + 1];
      if(typeof nextNestIdx === 'undefined') {
        // 取最后一个嵌套位置
        if(!array[currNestIdx]) {
          return console.log(`没有节点 ${_nestingInfo}`);
        }
        if(!array[currNestIdx]?.body) {
          array[currNestIdx].body = [];
        }
        array[currNestIdx].body.splice(currNestIdx, 1, addItem);
        return;
      } else {
        recursive(currDiveIdx + 1);
      }
    };
    recursive(0);
  }

  return array;
}

// console.log(addItem2NestingArr([[{}]], [0,0,0], { test: '123' }));

/**
 * 用于处理布局信息的 reducer
 */
export const layoutInfoReducer = (
  state: LayoutInfoActionReducerState = [],
  action: LayoutInfoActionReducerAction
): LayoutInfoActionReducerState => {
  switch (action.type) {
    case INIT_APP:
      const { pageContent } = action;
      return produce(pageContent, (draft) => (draft ? draft.content : state));
    case ADD_ENTITY:
      const addNextStateRes = produce(state, (draft) => {
        const { entity: addEntity, idx, nestingInfo } = action;
        const addNextState = addItem2NestingArr(draft, nestingInfo, addEntity);
        // const addNextState = update(state, {
        //   $splice: [
        //     [idx, 1, addEntity],
        //   ],
        // });
  
        return addNextState;
      });
      return addNextStateRes;
    case SORTING_ENTITY:
      const {
        dragIndex, hoverIndex, nestingInfo,
        entity: sortEntity, replace
      } = action;
      const nextStateForSorting = update(state, {
        $splice: [
          [dragIndex, replace ? 0 : 1],
          [hoverIndex, 0, sortEntity],
        ],
      });
      return nextStateForSorting;
    case SET_LAYOUT_STATE:
      const { state: _state } = action;
      return _state;
    case DEL_ENTITY:
      return update(state, {
        $splice: [
          [action.idx, 1],
        ],
      });
    case INIT_ENTITY_STATE:
      const nextStateInit = produce(state, (draftState) => {
        const { selectedEntityInfo: initSInfo, defaultEntityState } = action;
        const { nestingInfo: initIdx } = initSInfo;
        const targetData = getItemFromNestingItemsByBody(draftState, initIdx);
        targetData.propState = defaultEntityState;
        return draftState;
      });
      return nextStateInit;
    case UPDATE_ENTITY_STATE:
      return produce(state, (draftState) => {
        const { targetEntity: updateSInfo, formState } = action;
        const { nestingInfo: updateIdx } = updateSInfo;
        const targetData = getItemFromNestingItemsByBody(draftState, updateIdx);
        targetData.propState = formState;
        return draftState;
      });
    case CHANGE_ENTITY_TYPE:
      return produce(state, (draftState) => {
        const { targetEntity: updateSInfo, widgetType } = action;
        const { nestingInfo: updateIdx } = updateSInfo;
        const targetData = getItemFromNestingItemsByBody(draftState, updateIdx);
        targetData.widgetRef = widgetType;
        return draftState;
      });
    default:
      return state;
  }
};

/**
 * 将嵌套的数组转为 nodeTree 结构
 */
const flatArrayToNode = (items: any[], idKey = 'id') => {
  const array = flattenDeep(items);
  const resTree = {};
  for (const item of array) {
    resTree[item[idKey]] = item;
  }
  return resTree;
};

export function flatLayoutItemsReducer(
  state: FlatLayoutItems = {},
  action: LayoutInfoActionReducerAction
): FlatLayoutItems {
  switch (action.type) {
    case INIT_APP:
      const { pageContent } = action;
      if (pageContent?.content) {
        const flatContent = flatArrayToNode(pageContent.content);
        return flatContent;
      }
      return state;
    case ADD_ENTITY:
      const { entity } = action;
      return {
        ...state,
        [entity.id]: entity
      };
    case INIT_ENTITY_STATE:
      const nextStateInit = produce(state, (draftState) => {
        const { selectedEntityInfo: initSInfo, defaultEntityState } = action;
        const { entity } = initSInfo;
        if(entity) draftState[entity.id].propState = defaultEntityState;
        return draftState;
      });
      return nextStateInit;
    case UPDATE_ENTITY_STATE:
      return produce(state, (draftState) => {
        const { targetEntity: { entity }, formState, options } = action;
        const { id } = entity;

        /** 如果是替换模式 */
        if(options?.replace) {
          draftState[id].propState = formState;
        } else {
          draftState[id].propState = mergeDeep({}, draftState[id].propState, formState);
        }
        
        return draftState;
      });
    case DEL_ENTITY:
      return produce(state, (draft) => {
        const { idx, entity } = action;
        Reflect.deleteProperty(draft, entity.id);
        return draft;
      });
    default:
      return state;
  }
}
