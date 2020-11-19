/**
 * 属性项接入标准
 */

import { ChangeEntityState, PropItemMeta, WidgetEntity } from "@engine/visual-editor/data-structure";
import { PlatformCtx } from "./platform-ctx-types";

/** TODO: 完善属性项渲染器上下文的存放 */
export interface PropItemRenderContext {
  /** 编辑中的组件实例 */
  readonly widgetEntity: WidgetEntity
  /** 组件实例状态 */
  readonly editingWidgetState: any
  /** 更改组件实例状态的接口 */
  changeEntityState: ChangeEntityState
  /** 由平台提供的能力的上下文 */
  platformCtx: PlatformCtx
}

export interface PropItemRender {
  /** 渲染属性项 */
  render(propItemRenderCtx: PropItemRenderContext): JSX.Element
}

/**
 * 属性项的组件的接入标准
 */
export interface PropItemCompAccessSpec extends PropItemMeta, PropItemRender {

}

/**
 * 属性项集合
 */
export interface PropItemsCollection {
  [colID: string]: PropItemCompAccessSpec
}