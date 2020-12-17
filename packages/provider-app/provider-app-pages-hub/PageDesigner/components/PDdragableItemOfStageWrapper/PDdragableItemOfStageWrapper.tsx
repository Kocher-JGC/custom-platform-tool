/**
 * @author zxj
 *
 * 这里是画布与组件渲染的稳定抽象
 */

import React from "react";
import classnames from "classnames";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { TEMP_ENTITY_ID } from "@engine/visual-editor/utils";
import {
  DragItemComp,
  DragableItemWrapperFac,
} from "@engine/visual-editor/spec";
import { TempEntityTip } from "./TempEntityTip";
import { WidgetRenderer } from "../WidgetRenderer";
import { PDCustomEditorLoader } from "../PDCustomEditorLoader";
import { getWidgetMetadataSync } from "../../services";
import { PDDragableItemTypes } from "../../const";

import "./index.less";

const devEnv = process.env.NODE_ENV === "development";

const DevEnvInfo = ({ id, nestingInfo }) => {
  return devEnv ? (
    <div className="__dev_env_info">
      调试信息：id: {id}, nestingInfo: {JSON.stringify(nestingInfo)}
    </div>
  ) : null;
};

/**
 * 可拖动的组件实例的包装器
 */
export const PDdragableItemOfStageWrapper: DragableItemWrapperFac = ({
  onItemHover,
  onItemDrag,
  onItemDrop,
  onItemMove,
  onItemClick,
  onDelete,
  getLayoutNode,
  getSelectedState,
  getEntityProps,
  updateEntityState,
  // getHoveringEntity, setHoveringEntity
}) => (propsForChild) => {
  const { id, idx, nestingInfo: _nestingInfo, children } = propsForChild;

  /** nestingInfo 由于变量被后来的覆盖了，需要采用不可变数据 */
  const nestingInfo = [..._nestingInfo];

  const ctx = { idx, id, nestingInfo };
  const isSelected = getSelectedState(ctx);
  const entityState = getEntityProps(ctx) || {};
  const currEntity = getLayoutNode(ctx);

  if (!currEntity) return null;
  const widgetMeta = getWidgetMetadataSync(currEntity.widgetRef);

  const classes = classnames(["dragable-item", isSelected && "selected"]);

  const updateCtx = {
    nestingInfo,
    entity: currEntity,
  };

  const isTempEntity = currEntity._state === TEMP_ENTITY_ID;
  if (isTempEntity) {
    return <TempEntityTip key={id} />;
  }

  // 通过远端获取组件
  const actionCtx = { entity: currEntity, idx, nestingInfo };
  const { acceptChildStrategy } = currEntity;
  const isContainer = !!acceptChildStrategy;
  const dragItemType = acceptChildStrategy
    ? PDDragableItemTypes.containerWidget
    : PDDragableItemTypes.stageRealWidget;
  return (
    <div className={classes} key={id}>
      <DevEnvInfo id={id} nestingInfo={nestingInfo} />
      <DragItemComp
        nestingInfo={nestingInfo}
        sortable={true}
        onItemDrag={onItemDrag}
        onItemHover={onItemHover}
        onItemDrop={onItemDrop}
        onItemMove={onItemMove}
        dragableWidgetType={currEntity}
        type={dragItemType}
        isContainer={isContainer}
        className="relative drag-item"
        // canItemDrop={(dropType) => {
        //   return (
        //     dragItemType === PDDragableItemTypes.staticWidget &&
        //     dropType !== PDDragableItemTypes.staticWidget
        //   );
        // }}
        accept={[
          PDDragableItemTypes.containerWidget,
          PDDragableItemTypes.stageRealWidget,
          PDDragableItemTypes.staticWidget,
        ]}
      >
        {isTempEntity ? (
          <TempEntityTip key={id} />
        ) : (
          <>
            <WidgetRenderer
              // {...propsForChild}
              id={id}
              nestingInfo={nestingInfo}
              onClick={(e) => {
                e.stopPropagation();
                onItemClick(actionCtx);
              }}
              entity={currEntity}
              entityState={entityState || {}}
            >
              {children}
            </WidgetRenderer>
            <div className="action-area">
              <PDCustomEditorLoader
                // onClick={(e) => {
                //   onItemClick(e, actionCtx);
                // }}
                propEditor={widgetMeta?.propEditor}
                entityState={entityState}
                changeEntityState={(changeVal) => {
                  updateEntityState(updateCtx, changeVal);
                }}
              >
                <span className="t_green">
                  <EditOutlined className="action-btn" />
                </span>
                {/* <Button type="primary" shape="circle" icon={} /> */}
              </PDCustomEditorLoader>
              <span className="t_red">
                <DeleteOutlined
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(actionCtx);
                  }}
                />
              </span>
            </div>
          </>
        )}
      </DragItemComp>
    </div>
  );
};
