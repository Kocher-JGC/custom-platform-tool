/* eslint-disable no-param-reassign */
import produce from 'immer';
import { nanoid } from 'nanoid';
import {
  ENTITY_ID,
  increaseID,
} from '@engine/visual-editor/utils';
import {
  EditableWidgetMeta, WidgetEntity, TempWidgetEntityType
} from '../data-structure';
import { TEMP_ENTITY_ID } from './const';

export type MakeWidgetEntity = (
  widgetType: EditableWidgetMeta,
  options?: {
    genIDLen?: number
    state?: string
  }
) => WidgetEntity

/**
 * 实例化 widgetType
 */
export const makeWidgetEntity: MakeWidgetEntity = (
  widgetType: EditableWidgetMeta,
  options
) => {
  const {
    genIDLen = 8,
    state = 'active'
  } = options || {};
  const entityID = nanoid(genIDLen);

  /**
   * 1. 如果组件还没被实例化，则实例化组件类
   * 2. 下划线前缀为内部字段，用于表示已经实例化
   */
  const entity = produce(widgetType, (draft) => {
    Reflect.deleteProperty(draft, 'propItemsRely');
    draft.id = entityID;
    draft._state = state;
  });

  return entity;
};

export const makeTempWidgetEntity = (props = {}): TempWidgetEntityType => ({
  ...props,
  id: increaseID(Math.random(), TEMP_ENTITY_ID),
  _state: TEMP_ENTITY_ID,
});

export const isTempEntity = (entity) => entity._state === TEMP_ENTITY_ID;
