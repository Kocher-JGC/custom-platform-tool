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
  _rely: {}
};

/**
 * 删除 pageMetadata 的某项数据
 * @param pageMetadata
 * @param delID
 * 
 * TODO: 根据 _rely 依赖关系删除
 */
const delMetaData = (pageMetadata, delID) => {
  if (!pageMetadata) return;
  Object.keys(pageMetadata).forEach((metaID) => {
    if (metaID.indexOf(delID) !== -1) {
      Reflect.deleteProperty(pageMetadata, metaID);
    }
  });
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
        pageContent, initMeta
      } = action;
      return produce(pageContent, (draft) => {
        /**
         * 合并默认 meta 和由外部传入的 meta
         */
        const metaFormInit = draft?.meta;
        return mergeDeep({}, DefaultPageMeta, initMeta, metaFormInit);
      });
    case DEL_ENTITY:
      return produce(state, (draft) => {
        const { idx, entity: delE } = action;
        const { id: delEntityID } = delE;

        // 删除变量
        delMetaData(draft.varRely, delEntityID);

        // 删除动作
        delMetaData(draft.actions, delEntityID);

        // 删除数据源
        delMetaData(draft.dataSource, delEntityID);

        // 删除 schema
        delMetaData(draft.schema, delEntityID);
        return draft;
      });
    case CHANGE_METADATA:
      return produce(state, (draft) => {
        const { changeDatas } = action;
        changeDatas.forEach((changeData) => {
          const {
            data, datas, metaAttr, metaID, rmMetaID, replace, relyID
          } = changeData;
          /** 如果是 replace 模式，则直接替换整个 meta */
          if(replace) {
            draft[metaAttr] = data;
            return draft;
          }
          if(datas) {
            draft[metaAttr] = Object.assign({}, draft[metaAttr], datas);
          }
          if (!draft[metaAttr]) {
            console.error('尝试修改了不存在的 meta，请检查代码');
            draft[metaAttr] = {};
          }
          if (metaID) {
            draft[metaAttr][metaID] = data;
  
            /** 将依赖关系记录在 _rely 中 */
            if(!draft._rely) draft._rely = {};
            if(!draft._rely[metaID]) draft._rely[metaID] = [];
            if(relyID) draft._rely[metaID].push(relyID);
          } else {
            const newDataRefID = Object.keys(draft[metaAttr]).length + 1;
            Object.assign(draft[metaAttr], {
              [newDataRefID]: data
            });
          }
          if (rmMetaID && draft[metaAttr]) {
            Reflect.deleteProperty(draft[metaAttr], rmMetaID);
          }
        });
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
  payload?: {
    [payloadKey: string]: any
    /** 默认的 meta */
    defaultMeta?: any
  }
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
