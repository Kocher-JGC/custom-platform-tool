import produce from 'immer';
import { mergeDeep } from '@infra/utils/tools';
import {
  INIT_APP, InitAppAction, DEL_ENTITY, DelEntityAction,
  ADD_ENTITY, AddEntityAction, UPDATE_APP, UpdateAppAction, ChangeMetadataAction, CHANGE_METADATA
} from "../actions";
import { PageMetadata } from "../../data-structure";

const DefaultPageMeta: PageMetadata = {
  lastCompID: 0,
  dataSource: {},
  pageInterface: {},
  linkpage: {},
  schema: {},
  actions: {},
  varRely: {},
};

/**
 * 组件选择状态管理。如果组件未被实例化，则实例化后被选择
 */
export function pageMetadataReducer(
  state: PageMetadata = DefaultPageMeta,
  action: InitAppAction | AddEntityAction | ChangeMetadataAction | DelEntityAction
) {
  switch (action.type) {
    case INIT_APP:
      const {
        pageContent
      } = action;
      return produce(pageContent, (draft) => (draft ? draft.meta : state));
    case ADD_ENTITY:
      return produce(state, (draft) => {
        const { entity: { id, varAttr } } = action;
        if (varAttr) {
          // 设置变量
          const varAttrArr = Array.isArray(varAttr) ? varAttr : [...varAttr];
          draft.lastCompID += 1;
          if (!draft.varRely) draft.varRely = {};
          draft.varRely[id] = varAttrArr;
        }
        // varAttrArr.forEach((attr) => {
        //   const varAttrID = `${id}.${attr}`;
        //   draft.varAttr[varAttrID] = attr;
        // });
        return draft;
      });
    case DEL_ENTITY:
      return produce(state, (draft) => {
        const { idx, entity: delE } = action;
        // 删除变量
        Reflect.deleteProperty(draft.varRely, delE.id);

        // 删除动作
        Object.keys(draft.actions).forEach((actionID) => {
          if (actionID.indexOf(delE.id) !== -1) {
            Reflect.deleteProperty(draft.actions, actionID);
          }
        });
        return draft;
      });
    case CHANGE_METADATA:
      return produce(state, (draft) => {
        const {
          data, metaAttr, metaID, rmMetaID
        } = action;
        if (!draft[metaAttr]) {
          console.error('尝试修改了不存在的 meta，请检查代码');
          draft[metaAttr] = {};
        }
        if (metaID) {
          draft[metaAttr][metaID] = data;
        } else {
          const newDataRefID = Object.keys(draft[metaAttr]).length + 1;
          Object.assign(draft[metaAttr], {
            [newDataRefID]: data
          });
        }
        if (rmMetaID) {
          Reflect.deleteProperty(draft[metaAttr], rmMetaID);
        }
        return draft;
      });
    default:
      return state;
  }
}

export interface AppContext {
  /** App 是否做好准备 */
  ready: boolean
  /** 页面元数据 */
  payload?: any
}
/**
 * 整个应用的上下文数据
 */
export function appContextReducer(
  state = {
    ready: false
  },
  action: InitAppAction | UpdateAppAction
): AppContext {
  switch (action.type) {
    case INIT_APP:
      const {
        payload,
        name, id
      } = action;
      return {
        ready: true,
        payload,
      };
    case UPDATE_APP:
      const { type, ...otherState } = action;
      return produce(state, (draftState) => {
        // Object.assign(draftState, otherState);
        const nextStateVal = mergeDeep(draftState, otherState);
        return nextStateVal;
      });
    default:
      return state;
  }
}
