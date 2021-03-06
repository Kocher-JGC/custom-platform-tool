/**
 * CanvasStage
 */
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import classnames from 'classnames';

import LayoutParser from '@iub-dsl/parser/engin/layout';
import { ItemTypes } from '../ComponentPanel/types';
import {
  increaseID, parseFlatNodeToNestNode, wrapID, ENTITY_ID
} from './utils';
import { setNodeTreeNestingInfo } from './utils/node-filter';
import ContainerWrapperCom from './ContainerWrapperCom';
import ComponentWrapperCom from './ComponentWrapperCom';
import { EditorComponentClass } from '../../types';
import { stateOperatorFac } from './stateOperatorFac';

const StageRender = styled.div`
  min-height: 50vh;
  background-color: rgba(0,0,0, 0.05);
  padding: 10px;
  &.renderer {
    &.overing {
      background-color: rgba(0,0,0, 0.08);
    }
  }
`;

interface ContainerWrapperFacActions {
  onDrop?: (entity, containerID?) => void;
  onClick?: (event, id) => void;
}

/**
 * wrapper 生成器
 *
 * TODO: 性能优化
 */
const containerWrapperFac = (
  WrapperComponent,
  { onDrop, onClick }: ContainerWrapperFacActions,
  { flatLayoutNodes, getSelectedState }
) => (children, { id, idx, ...other }) => {
  return (
    <WrapperComponent
      {...other}
      currEntity={flatLayoutNodes[id]}
      onClick={onClick}
      onDrop={onDrop}
      getSelectedState={getSelectedState}
      id={id}
      key={id}
    >
      {children}
    </WrapperComponent>
  );
};

const componentInstantiation = (componentClass, id) => {
  return {
    ...componentClass,
    entityID: id,
    component: {
      type: componentClass.component
    }
  };
};

export interface CanvasStageProps {
  selectEntity
  selectedEntities
  children?: React.ReactChild
}

const CanvasStage = ({
  selectEntity,
  selectedEntities,
  children
}: CanvasStageProps) => {
  const [flatLayoutNodes, setLayoutContentCollection] = useState({});
  const [componentsCollection, setComponentsCollection] = useState({});
  // const [selectState, setSelectState] = useState({});

  // console.log('componentsCollection', componentsCollection);
  // console.log('flatLayoutNodes', flatLayoutNodes);

  const onSelectEntityForOnce = (clickEvent, { id, entity }) => {
    selectEntity(id, entity);
  };

  const {
    add: addContainer,
    update: updateContainer,
    del: delContainer
  } = stateOperatorFac(flatLayoutNodes, setLayoutContentCollection);

  const {
    add: addComponent,
    update: updateComponent,
    del: delComponent
  } = stateOperatorFac(componentsCollection, setComponentsCollection);

  /**
   * 相应拖放的放的动作的过滤器
   * 用于实例化 componentClass 或者更新 componentEntity
   */
  const onDropFilter = (componentClass, parentID?) => {
    const itemClassCopy = Object.assign({}, componentClass);
    if (parentID) {
      itemClassCopy.parentID = parentID;
    }

    /** 如果已经实例化的组件 */
    const isUpdate = itemClassCopy._state === 'active';

    /** 更新布局 */
    if (isUpdate) {
      return updateContainer(itemClassCopy.id, itemClassCopy);
    }

    switch (itemClassCopy.type) {
      case 'container':
        const entityID = increaseID(ENTITY_ID);
        itemClassCopy.entityID = entityID;
        const entity = addContainer(itemClassCopy);
        onSelectEntityForOnce(null, { id: entityID, entity });
        break;
      case 'component':
        /**
         * 如果是 component，添加一个组件引用，并且向 componentCollection 添加一个 component 实例
         */
        const componentRefID = increaseID(ENTITY_ID);
        const componentID = `comp_id_${componentRefID}`;
        const componentEntity = addComponent(componentInstantiation(itemClassCopy, componentID));
        const componentRefConfigClass = {
          entityID: componentRefID,
          type: "componentRef",
          componentID,
          parentID
        };
        addContainer(componentRefConfigClass);
        onSelectEntityForOnce(null, { id: componentID, entity: componentEntity });
        break;
    }
  };

  const [{
    isOverCurrent
  }, drop] = useDrop({
    accept: ItemTypes.DragComponent,
    drop: ({ dragItemClass }) => {
      // console.log('drop');
      if (isOverCurrent) {
        const _dragItemClass = { ...dragItemClass };
        delete _dragItemClass.parentID;
        onDropFilter(_dragItemClass);
      }
    },
    collect: (monitor) => ({
      // isOver: !!monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const parserContext = {
    context: {},
    bindAction: (actionID) => {
      // console.log(actionID);
      return {};
    },
    bindComponent: (componentID) => {
      return componentsCollection[componentID];
    },
  };
  const getSelectedState = (id) => {
    return !!selectedEntities[id];
  };
  const layoutNestingNodeTree = parseFlatNodeToNestNode(flatLayoutNodes);

  /**
   * 设置 node 信息
   */
  setNodeTreeNestingInfo(layoutNestingNodeTree, flatLayoutNodes);

  return (
    <div className="canvas-stage-container">
      <StageRender
        ref={drop}
        className={`canvas-stage renderer${isOverCurrent ? ' overing' : ''}`}
      >
        {
          /**
           * 通过 render prop 包装 layout 内部组件，达到动态控制内部组件实现的效果
           */
          LayoutParser({
            layoutNode: layoutNestingNodeTree,
            componentWrapper: containerWrapperFac(
              ComponentWrapperCom,
              {
                onClick: onSelectEntityForOnce,
              },
              {
                flatLayoutNodes,
                getSelectedState,
              }
            ),
            containerWrapper: containerWrapperFac(
              ContainerWrapperCom,
              {
                onDrop: onDropFilter,
                onClick: onSelectEntityForOnce,
              },
              {
                flatLayoutNodes,
                getSelectedState,
              }
            )
          }, parserContext)
        }
        {children}
      </StageRender>
    </div>
  );
};

export default CanvasStage;
