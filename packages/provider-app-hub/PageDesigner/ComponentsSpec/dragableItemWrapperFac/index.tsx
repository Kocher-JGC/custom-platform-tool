/**
 * @author zxj
 *
 * 这里是画布与组件渲染的稳定抽象
 */

import React from 'react';
import {
  LayoutWrapperContext
} from '@engine/layout-renderer';
import classnames from 'classnames';
import { EditorEntityState, EditorComponentEntity, TEMP_ENTITY_ID } from '@engine/visual-editor/types';
import {
  DragItemComp,
  ItemTypes,
  DragItemActions,
  getCompEntity
} from '@engine/visual-editor/spec';

import { TempEntityTip } from './TempEntityTip';
import { ComponentRenderer } from './ComponentRenderer';
import { EditBtn } from './EditBtn';
// import { Debounce } from '@mini-code/base-func';

export interface GetStateContext {
  nestingInfo
  idx
  id
}

export type GetEntityProps = (ctx: GetStateContext) => EditorEntityState | undefined
export type GetSelectedState = (ctx: GetStateContext) => boolean
export type GetLayoutNode = (ctx: GetStateContext) => EditorComponentEntity

export interface WrapperFacContext {
  /** 获取选中的组件实例的状态 */
  getSelectedState: GetSelectedState
  /** 获取组件实例的 props */
  getEntityProps: GetEntityProps
  /** 扁平的 node 结构 */
  getLayoutNode: GetLayoutNode
}

export interface WrapperFacActions extends DragItemActions {
  /** 响应组件点击事件 */
  onClick: (event, { entity: EditorComponentEntity, idx: number }) => void
  /** 响应组件点击事件 */
  onDelete: (event, { idx: number, entity: EditorComponentEntity }) => void
}

/**
 * 包装器的 options
 */
export interface WrapperFacOptions extends WrapperFacContext, WrapperFacActions {
}

/**
 * 包装器传给被包装的组件的 props
 */
export interface FacToComponentProps extends LayoutWrapperContext {
  onClick
  entity: EditorComponentEntity
  entityState: EditorEntityState
}

export type DragableItemWrapperFac = (
  wrapperFacOptions: WrapperFacOptions
) => (
  props: LayoutWrapperContext
) => JSX.Element

// const debounce = new Debounce();

/**
 * 可视化编辑器引擎的组件抽象实现
 */
export const dragableItemWrapperFac: DragableItemWrapperFac = (
  {
    onDrop, onMove, onClick, onDelete,
    getLayoutNode, getSelectedState, getEntityProps,
    // getHoveringEntity, setHoveringEntity
  },
) => (propsForChild) => {
  const {
    id, idx, nestingInfo, children
  } = propsForChild;
  const ctx = { idx, id, nestingInfo };
  const isSelected = getSelectedState(ctx);
  const entityState = getEntityProps(ctx);
  const currEntity = getLayoutNode(ctx);
  // const isHovering = getHoveringEntity(id);
  const classes = classnames([
    // isHovering && 'hovering',
    'dragable-item',
    isSelected && 'selected',
  ]);
  const isTempEntity = currEntity._state === TEMP_ENTITY_ID;

  return isTempEntity ? <TempEntityTip key={id} /> : (() => {
    const { component } = currEntity;
    const registeredEntity = getCompEntity(component.type);
    const { propEditor } = registeredEntity;
    return (
      <div
        className={classes}
        key={id}
      >
        <DragItemComp
          id={id}
          index={idx}
          onDrop={onDrop}
          onMove={onMove}
          dragItemClass={currEntity}
          type={ItemTypes.DragItemEntity}
          className="relative drag-item"
          accept={[ItemTypes.DragItemEntity, ItemTypes.DragItemClass]}
        >
          <ComponentRenderer
            {...propsForChild}
            onClick={(e) => {
              e.stopPropagation();
              onClick(e, { entity: currEntity, idx });
            }}
            entity={currEntity}
            registeredEntity={registeredEntity}
            entityState={entityState || {}}
          >
            {children}
          </ComponentRenderer>
          <div className="action-area">
            {
              propEditor && <EditBtn />
            }
            <span
              className="default btn red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e, { idx, entity: currEntity });
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
