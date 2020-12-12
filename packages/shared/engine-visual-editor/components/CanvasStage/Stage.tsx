/**
 * CanvasStage
 */
import React from "react";
import { ElemNestingInfo, LayoutRenderer } from "@engine/layout-renderer";
import produce from "immer";
import {
  LayoutInfoActionReducerState,
  WidgetEntity,
  PageMetadata,
} from "@engine/visual-editor/data-structure";
import {
  WrapperFacOptions,
  DragableItemWrapperFac,
  GetStateContext,
  WrapperItemClickEvent,
} from "@engine/visual-editor/spec";
import { Debounce } from "@mini-code/base-func";
import {
  makeWidgetEntity,
  makeTempWidgetEntity,
  getItemFromNestingItems,
  VEDispatcher,
  SelectEntityState,
} from "@engine/visual-editor/core";
import { PDDragableItemTypes } from "@provider-app/page-designer/const";
import DropStageContainer from "./DropStageContainer";
import { DnDContext } from "../../spec";

/**
 * 中央舞台组件的 props
 */
export interface CanvasStageProps extends VEDispatcher {
  /** 组件包接入规范  */
  dragableItemWrapper: DragableItemWrapperFac;
  /** 页面的状态 */
  pageEntityState?: {
    style: CSSStyleRule;
  };
  /** 页面元数据 */
  pageMetadata: PageMetadata;
  /** 布局信息 */
  layoutNodeInfo: LayoutInfoActionReducerState;
  /** 选中的组件实例 */
  selectedInfo: SelectEntityState;
  /** 点击舞台的事件回调 */
  onStageClick?: () => void;
  /** 增加 entity 的回调 */
  onAddEntity?: (entity) => void;
}

const debounceAddTempEntity = new Debounce();

/**
 * 中央舞台组件
 */
class CanvasStage extends React.Component<CanvasStageProps> {
  /** 用于记录最后拖拽的实例的 idx */
  lastMoveIdx!: number | undefined;

  /** 用于记录被拖动的实例的原 idx */
  dragItemOriginIdx!: number | undefined;

  getNodeItemFromNesting = (nestingInfo: ElemNestingInfo) => {
    return getItemFromNestingItems(
      this.props.layoutNodeInfo,
      nestingInfo,
      "body"
    );
  };

  getLayoutNode = ({ nestingInfo }: GetStateContext) => {
    return this.getNodeItemFromNesting(nestingInfo);
  };

  /**
   * 查看组件实例是否被选中
   */
  getSelectedState = ({ id }: GetStateContext) => {
    return this.props.selectedInfo.id === id;
  };

  getEntityProps = ({ nestingInfo }: GetStateContext) => {
    return this.getNodeItemFromNesting(nestingInfo)?.propState;
  };

  addEntityToStage = () => {};

  /**
   * @description
   * 1. 响应拖放的放的动作的调度器
   * 2. 用于实例化 widgetType
   *
   * @description
   * 重要策略，用于向舞台实例化组件
   * 1. 如果没有 dropTargetCtx，则认为直接拖入到舞台
   * 2. 如果有 dropTargetCtx，则认为组件被拖动到某个组件之上，又分两种情况：
   *    a. 组件是排序的，并不会产生上下级关系
   *    b. 组件被放入某个布局容器职中，将产生上下级关系，这里是布局的关键策略点
   */
  handleItemDrop = (
    dragWidgetMeta: WidgetEntity,
    dropTargetCtx?: DnDContext
  ) => {
    const { layoutNodeInfo, AddEntity, onAddEntity } = this.props;

    // 切断原型链
    const widgetMetaCopy = { ...dragWidgetMeta };
    const addEntityNestingInfo: ElemNestingInfo = [];

    let addEntityIdx: number;
    // if (!dropTargetCtx) {
    if (typeof this.lastMoveIdx === "undefined") {
      addEntityIdx = layoutNodeInfo.length;
    } else {
      addEntityIdx = this.lastMoveIdx;
    }
    addEntityNestingInfo[0] = addEntityIdx;
    // } else {
    // const { nestingInfo, dropTargetItem } = dropTargetCtx;
    // 如果有放的项
    // if (dropTargetItem) {
    //   const { acceptChildStrategy } = dropTargetItem;
    //   if (acceptChildStrategy) {
    //     // TODO: 完善布局信息
    //     addEntityNestingInfo = [...nestingInfo];
    //     const parentID = dropTargetItem.id;
    //     // 如果被放的项是可以被嵌套的，则将该组件放入父级组件中
    //     if (parentID) {
    //       widgetMetaCopy.parentID = parentID;
    //     }
    //   }
    // }
    // if (typeof idx !== 'undefined') {
    //   addEntityIdx = idx;
    // }
    // }

    /** 是否已经实例化的组件 */
    const isMotify = widgetMetaCopy._state === "active";

    if (!isMotify) {
      /** 实例化组件类 */
      const entity = makeWidgetEntity(widgetMetaCopy);
      AddEntity(entity, {
        nestingInfo: addEntityNestingInfo,
      });
      onAddEntity?.(entity);
    }

    this.lastMoveIdx = undefined;
  };

  handleDeleteElement = ({ nestingInfo, entity }) => {
    this.props.DelEntity(nestingInfo, entity);
  };

  /**
   * 点击选择组件实例的处理
   */
  handleSelectEntityForClick: WrapperItemClickEvent = (actionCtx) => {
    const { SelectEntity, selectedInfo } = this.props;
    const { entity, nestingInfo } = actionCtx;
    /** 如果已经被选择，则不需要再触发事件 */
    if (nestingInfo.join("") === selectedInfo.nestingInfo.join("")) return;
    SelectEntity(entity, nestingInfo);
  };

  /**
   * 响应元素的拖事件，作用于排序
   */
  handleItemMove = (
    dragItemNestIdx: ElemNestingInfo,
    hoverItemNestIdx: ElemNestingInfo,
    dragItem
  ) => {
    /** 防止没有 dragItemNestIdx 而产生坏数据 */
    if (!dragItemNestIdx || dragItemNestIdx.length === 0) return;
    // this.dragItemOriginIdx = dragItemNestIdx;
    /** 取消由进入画布时触发的添加临时组件 */
    debounceAddTempEntity.cancel();
    const { SortingEntity } = this.props;
    let dragEntity = this.getNodeItemFromNesting(dragItemNestIdx);
    let replaceItem = false;
    if (!dragEntity) {
      /** 如果没有实例，则创建临时实例 */
      dragEntity = makeTempWidgetEntity();
      replaceItem = true;
    }
    /** 将最后的实例 idx 存储下来 */
    this.lastMoveIdx = hoverItemNestIdx;
    SortingEntity(dragItemNestIdx, hoverItemNestIdx, dragEntity, {
      replace: replaceItem,
    });
  };

  /**
   * 接入标准的上下文
   */
  wrapperContext: WrapperFacOptions = {
    getLayoutNode: this.getLayoutNode,
    getSelectedState: this.getSelectedState,
    getEntityProps: this.getEntityProps,
    onItemDrop: this.handleItemDrop,
    onItemMove: this.handleItemMove,
    onDelete: this.handleDeleteElement,
    onItemClick: this.handleSelectEntityForClick,
    updateEntityState: this.props.UpdateEntityState,
  };

  render() {
    const {
      layoutNodeInfo,
      pageEntityState,
      // selectedInfo,
      onStageClick,
      dragableItemWrapper,
    } = this.props;
    const hasNode = layoutNodeInfo.length > 0;

    const pageStyle = pageEntityState?.style;

    return (
      <div className="canvas-stage-container">
        <LayoutRenderer
          layoutNode={layoutNodeInfo}
          componentRenderer={dragableItemWrapper(this.wrapperContext)}
          RootRender={(child) => (
            <DropStageContainer
              triggerCondition={(dragItem) => {
                return (
                  dragItem && dragItem.type === PDDragableItemTypes.staticWidget
                );
              }}
              accept={[
                PDDragableItemTypes.containerWidget,
                PDDragableItemTypes.stageRealWidget,
                PDDragableItemTypes.staticWidget,
              ]}
              onLeave={(item) => {
                /** 移出 item */
                if (typeof item.nestingInfo !== "undefined") {
                  this.handleDeleteElement({
                    nestingInfo: item.nestingInfo,
                    entity: item,
                  });
                }
              }}
              onEnter={(item) => {
                const layoutNodeInfoLen = layoutNodeInfo.length;
                /** 设置 dragClass 的 index，用于排序 */
                item.nestingInfo = [layoutNodeInfoLen];
                /**
                 * 延后将临时组件实例添加到画布，属于交互体验优化
                 */
                debounceAddTempEntity.exec(() => {
                  this.handleItemMove(
                    item.nestingInfo,
                    layoutNodeInfoLen,
                    item
                  );
                }, 50);
              }}
              onItemDrop={(_dragableItemDef, dropOptions) => {
                if (dropOptions.type !== PDDragableItemTypes.staticWidget) {
                  return;
                }
                console.log(_dragableItemDef);
                this.handleItemDrop(_dragableItemDef);
              }}
              onStageClick={onStageClick}
              style={pageStyle}
            >
              {hasNode ? child : <div>请从左边拖入组件</div>}
            </DropStageContainer>
          )}
        />
      </div>
    );
  }
}

export default CanvasStage;