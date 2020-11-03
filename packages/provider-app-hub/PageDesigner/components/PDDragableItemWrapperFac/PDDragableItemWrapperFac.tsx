/**
 * @author zxj
 *
 * 这里是画布与组件渲染的稳定抽象
 */

import React from 'react';
import classnames from 'classnames';
import { TEMP_ENTITY_ID } from '@engine/visual-editor/data-structure';
import {
  DragItemComp,
  DragableItemTypes,
  DragableItemWrapperFac
} from '@engine/visual-editor/spec';
import { TempEntityTip } from './TempEntityTip';
import { WidgetRenderer } from '../WidgetRenderer';
import { PDCustomEditorLoader } from '../PDCustomEditorLoader';
import { getWidgetMetadataSync } from '../../services';

/**
 * 可视化编辑器引擎的组件抽象实现
 */
export const PDdragableItemWrapperFac: DragableItemWrapperFac = (
  {
    onItemDrop, onItemMove, onItemClick, onDelete,
    getLayoutNode, getSelectedState, getEntityProps,
    UpdateEntityState
    // getHoveringEntity, setHoveringEntity
  },
) => (propsForChild) => {
  const {
    id, idx, nestingInfo: _nestingInfo, children
  } = propsForChild;

  /** nestingInfo 由于变量被后来的覆盖了，需要采用不可变数据 */
  const nestingInfo = [..._nestingInfo];

  const ctx = { idx, id, nestingInfo };
  const isSelected = getSelectedState(ctx);
  const entityState = getEntityProps(ctx) || {};
  const currEntity = getLayoutNode(ctx);
  const widgetMeta = getWidgetMetadataSync(currEntity.widgetRef);

  const classes = classnames([
    'dragable-item',
    isSelected && 'selected',
  ]);

  const updateCtx = {
    nestingInfo, entity: currEntity
  };

  const isTempEntity = currEntity._state === TEMP_ENTITY_ID;

  return isTempEntity ? <TempEntityTip key={id} /> : (() => {
    const { propEditor } = widgetMeta;

    // 通过远端获取组件
    const actionCtx = { entity: currEntity, idx, nestingInfo };
    return (
      <div
        className={classes}
        key={id}
      >
        <DragItemComp
          id={id}
          index={idx}
          onItemDrop={onItemDrop}
          onItemMove={onItemMove}
          dragableWidgetType={currEntity}
          type={DragableItemTypes.DragItemEntity}
          className="relative drag-item"
          accept={[DragableItemTypes.DragItemEntity, DragableItemTypes.DragableItemType]}
        >
          <WidgetRenderer
            {...propsForChild}
            onClick={(e) => {
              e.stopPropagation();
              onItemClick(e, actionCtx);
            }}
            entity={currEntity}
            entityState={entityState || {}}
          >
            {children}
          </WidgetRenderer>
          <div className="action-area">
            <PDCustomEditorLoader
              propEditor={propEditor}
              entityState={entityState}
              changeEntityState={(changeVal) => {
                // updateEntityState(changeVal);
                UpdateEntityState(updateCtx, changeVal);
              }}
            />
            <span
              className="default btn red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e, actionCtx);
              }}
            >
              删除
            </span>
          </div>
        </DragItemComp>
      </div>
    );
  })();
};
