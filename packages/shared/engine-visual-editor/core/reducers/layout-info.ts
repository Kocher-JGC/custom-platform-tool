// import update from 'immutability-helper';
import produce from 'immer';
// import { mergeDeep } from '@infra/utils/tools';
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
  ChangeEntityTypeAction,
  AddTempEntityAction,
  ADD_TEMP_ENTITY
} from '../actions';
import { flatArrayToNode, getItemFromNestingItemsByBody, setItem2NestingArr, TEMP_ENTITY_ID } from '../../utils';

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
  AddTempEntityAction |
  InitAppAction

// interface SetItem2NestingArrOptions {
//   addItem?
//   spliceCount: number
// }

// /**
//  * 设置嵌套数组
//  * @param array
//  * @param nestingInfo
//  * @param param2
//  */
// function setItem2NestingArr(array: any[], nestingInfo: ElemNestingInfo, {
//   addItem,
//   spliceCount = 0
// }: SetItem2NestingArrOptions) {
//   const _nestingInfo = [...nestingInfo];
//   const targetAddPosition = _nestingInfo.pop() as number;
//   if (_nestingInfo.length === 0) {
//     const spliceParams = [targetAddPosition, spliceCount];
//     if (addItem) {
//       spliceParams.push(addItem);
//     }
//     Array.prototype.splice.apply(array, spliceParams);
//   } else {
//     const recursive = (currDiveIdx) => {
//       const currNestIdx = _nestingInfo[currDiveIdx];
//       const nextNestIdx = _nestingInfo[currDiveIdx + 1];
//       if (typeof nextNestIdx === 'undefined') {
//         // 取最后一个嵌套位置
//         if (!array[currNestIdx]) {
//           return console.log(`没有节点 ${_nestingInfo}`);
//         }
//         if (!array[currNestIdx]?.body) {
//           array[currNestIdx].body = [];
//         }
//         const _spliceParams = [targetAddPosition, spliceCount];
//         if (addItem) {
//           _spliceParams.push(addItem);
//         }
//         Array.prototype.splice.apply(array[currNestIdx].body, _spliceParams);
//       } else {
//         recursive(currDiveIdx + 1);
//       }
//     };
//     recursive(0);
//   }

//   return array;
// }

// /**
//  * 嵌套数组中的元素交换
//  */
// const swapItemInNestArray = (nestArray, sourceIdx, targetIdx) => {
//   const sourceItemNestIdxStr = `[${sourceIdx.join('][')}]`;
//   const swapItemNestIdxStr = `[${targetIdx.join('][')}]`;
//   const swapSrcTempItem = at(nestArray, [sourceItemNestIdxStr]);
//   const swapTarTempItem = at(nestArray, [swapItemNestIdxStr]);

//   setItem2NestingArr(nestArray, targetIdx, {
//     addItem: swapSrcTempItem[0],
//     spliceCount: 1
//   });

//   setItem2NestingArr(nestArray, sourceIdx, {
//     addItem: swapTarTempItem[0],
//     spliceCount: 1
//   });

//   return nestArray;
// };

// /**
//  * 将元素推入嵌套数组中
//  */
// const putItemInNestArray = (nestArray, sourceIdx, targetIdx, putIdx) => {
//   const sourceItemNestIdxStr = `[${sourceIdx.join('][')}]`;
//   const swapSrcTempItem = at(nestArray, [sourceItemNestIdxStr]);

//   setItem2NestingArr(nestArray, sourceIdx, {
//     spliceCount: 1
//   });

//   setItem2NestingArr(nestArray, [...targetIdx, putIdx], {
//     addItem: swapSrcTempItem[0],
//     spliceCount: 0
//   });

//   return nestArray;
// };

/**
 * 清楚临时的 entity
 */
const clearTmplWidget = (layoutInfoState: LayoutInfoActionReducerState) => {
  return layoutInfoState.filter((item) => item._state !== TEMP_ENTITY_ID);
};

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
        const { entity: addEntity, nestingInfo } = action;
        const addNextState = setItem2NestingArr(draft, nestingInfo, {
          addItem: addEntity,
          spliceCount: 1
        });

        return addNextState;
      });
      return clearTmplWidget(addNextStateRes);
    case ADD_TEMP_ENTITY:
      return produce(state, (draft) => {
        const { entity: addEntity, nestingInfo } = action;
        const addNextState = setItem2NestingArr(draft, nestingInfo, {
          addItem: addEntity,
          spliceCount: 0
        });
        return addNextState;
      });
    // case SORTING_ENTITY:
    //   return produce(state, (draft) => {
    //     const { sortOptions } = action;
    //     if(sortOptions.type === 'swap') {
    //       const { sourceItemNestIdx, swapItemNestIdx } = sortOptions;
    //       if(sourceItemNestIdx && swapItemNestIdx && sourceItemNestIdx.length === swapItemNestIdx.length) {
    //         swapItemInNestArray(draft, sourceItemNestIdx, swapItemNestIdx);
    //         return draft;
    //       }
    //       console.error(`交换的 idx 的长度不一致，请检查调用`);
    //     } else {
    //       const { sourceItemNestIdx, putIdx, putItemNestIdx } = sortOptions;
    //       putItemInNestArray(draft, sourceItemNestIdx, putItemNestIdx, putIdx);
    //     }
    //   });
    case SET_LAYOUT_STATE:
      const { state: _state } = action;
      return _state;
    case DEL_ENTITY:
      const nextStateOfDef = produce(state, (draft) => {
        const { nestingInfo } = action;
        const nextState = setItem2NestingArr(draft, nestingInfo, {
          spliceCount: 1
        });
        return nextState;
        // return update(state, {
        //   $splice: [
        //     [action.idx, 1],
        //   ],
        // });
      });
      return nextStateOfDef;
    case INIT_ENTITY_STATE:
      const nextStateInit = produce(state, (draftState) => {
        const { selectedEntityInfo, defaultEntityState } = action;
        const { nestingInfo } = selectedEntityInfo;
        const targetData = getItemFromNestingItemsByBody(draftState, nestingInfo);
        if(!targetData) {
          console.log(`没找到对象：`, `selectedEntityInfo:`, selectedEntityInfo, `nestingInfo:`, nestingInfo);
          return draftState;
        }
        targetData.propState = defaultEntityState;
        return draftState;
      });
      return nextStateInit;
    case UPDATE_ENTITY_STATE:
      return produce(state, (draftState) => {
        const { targetEntity, formState } = action;
        const { nestingInfo } = targetEntity;
        const targetData = getItemFromNestingItemsByBody(draftState, nestingInfo);

        if(!targetData) {
          console.log(`没找到对象：`, `targetEntity:`, targetEntity, `nestingInfo:`, nestingInfo);
          return draftState;
        }
        targetData.propState = formState;
        return draftState;
      });
    case CHANGE_ENTITY_TYPE:
      return produce(state, (draftState) => {
        const { targetEntity: updateSInfo, widgetType } = action;
        const { nestingInfo } = updateSInfo;
        const targetData = getItemFromNestingItemsByBody(draftState, nestingInfo);
        targetData.widgetRef = widgetType;
        return draftState;
      });
    default:
      return state;
  }
};

// export function flatLayoutItemsReducer(
//   state: FlatLayoutItems = {},
//   action: LayoutInfoActionReducerAction
// ): FlatLayoutItems {
//   switch (action.type) {
//     case INIT_APP:
//       const { pageContent } = action;
//       if (pageContent?.content) {
//         const flatContent = flatArrayToNode(pageContent.content);
//         return flatContent;
//       }
//       return state;
//     case ADD_ENTITY:
//       return produce(state, (draft) => {
//         const { entity } = action;
//         return Object.assign(draft, {
//           [entity.id]: entity
//         });
//       });
//     case INIT_ENTITY_STATE:
//       const nextStateInit = produce(state, (draftState) => {
//         const { selectedEntityInfo: initSInfo, defaultEntityState } = action;
//         const { entity } = initSInfo;
//         if (entity) draftState[entity.id].propState = defaultEntityState;
//         return draftState;
//       });
//       return nextStateInit;
//     case UPDATE_ENTITY_STATE:
//       return produce(state, (draftState) => {
//         const { targetEntity: { entity }, formState, options } = action;
//         const { id } = entity;

//         /** 如果是替换模式 */
//         if (options?.replace) {
//           draftState[id].propState = formState;
//         } else {
//           draftState[id].propState = mergeDeep({}, draftState[id].propState, formState);
//         }

//         return draftState;
//       });
//     case DEL_ENTITY:
//       return produce(state, (draft) => {
//         const { entity } = action;
//         Reflect.deleteProperty(draft, entity.id);
//         return draft;
//       });
//     default:
//       return state;
//   }
// }
