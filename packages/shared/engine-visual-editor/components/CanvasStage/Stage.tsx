/* eslint-disable no-nested-ternary */
/**
 * CanvasStage
 */
import React from "react";
import {
  ElemNestingInfo,
  getItemIdx,
  getItemParentIdx,
  LayoutRenderer,
} from "@engine/layout-renderer";
import produce from "immer";
import dropRight from "lodash/dropRight";
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
  DragItemMove,
} from "@engine/visual-editor/spec";
import { Debounce } from "@mini-code/base-func";
import { VEDispatcher, SelectEntityState } from "@engine/visual-editor/core";
import {
  makeWidgetEntity,
  makeTempWidgetEntity,
  getItemFromNestingItems,
  putItemInNestArray,
  SortingActionPut,
  SortingActionSwap,
  swapItemInNestArray,
  pullItemInNestArray,
  SortingActionPull,
} from "@engine/visual-editor/utils";
import DropStageContainer, { DropStageProps } from "./DropStageContainer";

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
  accept: string[];
  /** 点击舞台的事件回调 */
  onStageClick?: () => void;
  /** 增加 entity 的回调 */
  onAddEntity?: (entity) => void;
  /** 判断是否可以拖入画布中 */
  triggerCondition?: DropStageProps["triggerCondition"];
}

const debounceAddTempEntity = new Debounce();

interface DragingItemCtx {
  /** 实时记录拖动元素在画布中的嵌套信息 */
  nestingInfo: ElemNestingInfo;
  /**
   * 拖动元素的类型
   * 1. temp：刚拖入到画布中的临时元素，此时还未赋值，被赋值后成为 entity
   * 2. entity：被赋值 nestingInfo 后的元素
   */
  type?: "temp" | "entity";
}

/**
 * 中央舞台组件
 */
class CanvasStage extends React.Component<CanvasStageProps> {
  /**
   * 重要策略，用于管理被拖动的元素的上下文状态
   */
  draggingItemCtx: DragingItemCtx | null = {
    nestingInfo: [],
    type: "temp",
  };

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
   */
  handleItemDrop = (dragWidgetMeta: WidgetEntity, dropDndCtx) => {
    const { AddEntity, onAddEntity } = this.props;

    // 切断原型链
    const widgetMetaCopy = { ...dragWidgetMeta };

    const nestingInfo = this.draggingItemCtx?.nestingInfo;

    /** 是否已经实例化的组件 */
    const isMotify = widgetMetaCopy._state === "active";

    if (!isMotify && nestingInfo) {
      /** 实例化组件类 */
      const entity = makeWidgetEntity(widgetMetaCopy);
      AddEntity(entity, {
        nestingInfo,
      });
      onAddEntity?.(entity);
    }

    this.dropEnd();
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

  createTempEntity = (nestInfo) => {
    const dragEntity = makeTempWidgetEntity();
    this.props.AddTempEntity(dragEntity, {
      nestingInfo: nestInfo,
    });
  };

  /**
   * 响应元素的拖事件，作用于排序
   */
  handleItemMove: DragItemMove = (
    dragItemNestIdx,
    hoverItemNestIdx,
    options
  ) => {
    const { type, direction } = options || {};
    if (!dragItemNestIdx) {
      /** 防止没有 dragItemNestIdx 而产生坏数据 */
      return;
    }
    const _dragItemNestIdx = this.draggingItemCtx?.nestingInfo;

    if (!_dragItemNestIdx) {
      console.log(`没有 this.draggingItemCtx?.nestingInfo，请检查`);
      return;
    }
    // const _dragItemNestIdx = dragItemNestIdx;
    // if (_dragItemNestIdx.length === 0 && this.draggingItemCtx?.nestingInfo) {
    //   /** 如果是 temp entity，则将 draggingItemCtx nestingInfo 赋值给 _dragItemNestIdx */
    //   _dragItemNestIdx = this.draggingItemCtx?.nestingInfo;
    // }
    /** 取消由进入画布时触发的添加临时组件 */
    debounceAddTempEntity.cancel();
    const dragEntity = this.getNodeItemFromNesting(_dragItemNestIdx);
    if (!dragEntity) return;

    if (type === "sort") {
      this.sortLayoutItems({
        type: "swap",
        sourceItemNestIdx: _dragItemNestIdx,
        swapItemNestIdx: hoverItemNestIdx,
      });
    } else if (type === "enter") {
      const dragContainerEntity = this.getNodeItemFromNesting(hoverItemNestIdx);
      const containerChildLen = dragContainerEntity.body?.length || 0;

      /**
       * 1. 如果是从上方或者左边进入容器，则将元素插入到容器的第 0 位
       * 2. 如果从下方或者右边进入容器，则将元素插入到容器的末尾
       */
      const putIdx = /top|left/.test(direction) ? 0 : containerChildLen;

      this.sortLayoutItems({
        type: "put",
        sourceItemNestIdx: _dragItemNestIdx,
        putItemNestIdx: hoverItemNestIdx,
        putIdx,
      });
    } else if (type === "exit") {
      const brotherNodeIdx = getItemIdx(hoverItemNestIdx) || 0;
      const toLastIdx = /top|left/.test(direction)
        ? brotherNodeIdx - 1
        : brotherNodeIdx + 1;

      this.sortLayoutItems({
        type: "pull",
        sourceItemNestIdx: _dragItemNestIdx,
        toNestIdx: [...dropRight(_dragItemNestIdx, 2), toLastIdx],
      });
    }
  };

  sortLayoutItems = (
    sortOptions: SortingActionSwap | SortingActionPut | SortingActionPull
  ) => {
    const { layoutNodeInfo, SetLayoutInfo } = this.props;

    const nextLayoutNodeInfo = produce(layoutNodeInfo, (draft) => {
      if (sortOptions.type === "swap") {
        const { sourceItemNestIdx, swapItemNestIdx } = sortOptions;
        if (
          sourceItemNestIdx &&
          swapItemNestIdx &&
          sourceItemNestIdx.length === swapItemNestIdx.length
        ) {
          swapItemInNestArray(draft, sourceItemNestIdx, swapItemNestIdx);

          /** 设置 draggingItemCtx 的类型为 entity */
          this.setDragCtx({
            nestingInfo: swapItemNestIdx,
            type: "entity",
          });
        } else {
          console.error(`交换的 idx 的长度不一致，请检查调用`);
        }
      } else if (sortOptions.type === "put") {
        const { sourceItemNestIdx, putIdx, putItemNestIdx } = sortOptions;
        const swapItemNestIdx = putItemInNestArray(
          draft,
          sourceItemNestIdx,
          putItemNestIdx,
          putIdx
        );

        /** 设置 draggingItemCtx 的类型为 entity */
        this.setDragCtx({
          nestingInfo: swapItemNestIdx,
          type: "entity",
        });
      } else if (sortOptions.type === "pull") {
        const { sourceItemNestIdx, toNestIdx } = sortOptions;
        // console.log(sortOptions);
        pullItemInNestArray(draft, sourceItemNestIdx, toNestIdx);

        /** 设置 draggingItemCtx 的类型为 entity */
        this.setDragCtx({
          nestingInfo: toNestIdx,
          type: "entity",
        });
      }

      return draft;
    });

    SetLayoutInfo(nextLayoutNodeInfo);
  };

  /**
   * 维护 dragging item 上下文
   * @param dragCtx
   */
  handleItemDrag = (dragCtx) => {
    this.setDragCtx({ nestingInfo: dragCtx.nestingInfo });
  };

  handleItemHover = (hoverItemIdx, { isContainer }) => {
    /** 维护 temp 元素的拖拽上下文 */
    if (this.draggingItemCtx?.type === "temp" && !isContainer) {
      this.sortLayoutItems({
        type: "swap",
        sourceItemNestIdx: this.draggingItemCtx?.nestingInfo,
        swapItemNestIdx: hoverItemIdx,
      });
    }
  };

  setDragCtx = (ctx: DragingItemCtx) => {
    if (!this.draggingItemCtx) {
      console.error(`this.draggingItemCtx 为空，请检查调用链路`);
    }
    this.draggingItemCtx = Object.assign({}, this.draggingItemCtx, ctx);
  };

  dropEnd = () => {
    this.draggingItemCtx = null;
  };

  /**
   * 接入标准的上下文
   */
  wrapperContext: WrapperFacOptions = {
    getLayoutNode: this.getLayoutNode,
    getSelectedState: this.getSelectedState,
    getEntityProps: this.getEntityProps,
    onItemHover: this.handleItemHover,
    onItemDrag: this.handleItemDrag,
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
      accept,
      onStageClick,
      triggerCondition,
      dragableItemWrapper,
    } = this.props;
    // console.log(layoutNodeInfo);
    const hasNode = layoutNodeInfo.length > 0;

    const pageStyle = pageEntityState?.style;

    return (
      <div className="canvas-stage-container">
        <LayoutRenderer
          layoutNode={layoutNodeInfo}
          componentRenderer={dragableItemWrapper(this.wrapperContext)}
          RootRender={(child) => (
            <DropStageContainer
              triggerCondition={triggerCondition}
              accept={accept}
              onEnter={(item) => {
                const layoutNodeInfoLen = layoutNodeInfo.length;
                /** 设置 dragClass 的 index，用于排序，维护 temp 元素的拖拽生命周期 */
                this.setDragCtx({
                  nestingInfo: [layoutNodeInfoLen],
                  type: "temp",
                });
                this.createTempEntity(this.draggingItemCtx?.nestingInfo);
              }}
              onLeave={(item) => {
                /** 移出 item */
                if (this.draggingItemCtx) {
                  this.handleDeleteElement({
                    nestingInfo: this.draggingItemCtx.nestingInfo,
                    entity: item,
                  });
                }

                this.dropEnd();
              }}
              onItemDrop={(_dragableItemDef, dropOptions) => {
                if (this.draggingItemCtx) {
                  this.handleItemDrop(_dragableItemDef);
                }

                this.dropEnd();
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
