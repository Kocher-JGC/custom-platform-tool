import update from 'immutability-helper';
import produce from 'immer';
import { LayoutInfoActionReducerState } from "../../types";
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
  InitAppAction
} from '../actions';
import { getItemFromNestingItemsByBody } from '../utils';

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
  InitAppAction

// /**
//  * state 的数据结构
//  */
// export interface LayoutInfoActionReducerState {
//   [entityID: string]: EditorComponentEntity
// }

/**
 * 用于处理布局信息的 reducer
 */
export const layoutInfoReducer = (
  state: LayoutInfoActionReducerState = [],
  action: LayoutInfoActionReducerAction
): LayoutInfoActionReducerState => {
  switch (action.type) {
    case INIT_APP:
      const { pageData } = action;
      return produce(pageData, (draft) => (draft ? draft.content : state));
    case ADD_ENTITY:
      const { entity: addEntity, idx } = action;
      const addNextState = update(state, {
        $splice: [
          [idx, 1, addEntity],
        ],
      });

      return addNextState;
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
      const { selectedEntityInfo: initSInfo, defaultEntityState } = action;
      const { activeEntityNestingIdx: initIdx } = initSInfo;
      const nextStateInit = produce(state, (draftState) => {
        const targetData = getItemFromNestingItemsByBody(draftState, initIdx);
        // eslint-disable-next-line no-param-reassign
        targetData.propState = defaultEntityState;
        return draftState;
      });
      return nextStateInit;
    case UPDATE_ENTITY_STATE:
      const { selectedEntityInfo: updateSInfo, formState } = action;
      const { activeEntityNestingIdx: updateIdx } = updateSInfo;
      return produce(state, (draftState) => {
        const targetData = getItemFromNestingItemsByBody(draftState, updateIdx);
        targetData.propState = formState;
        return draftState;
      });
    default:
      return state;
  }
};
