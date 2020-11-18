/// //////////////// 属性项 ///////////////////

import { ChangeMetadata } from "../core";
import { PageMetadata } from "./page-metadata";
import { WidgetEntity } from "./widget";

export interface WidgetEditablePropMeta {
  /** 属性的类型 */
  type: 'string' | 'number' | 'boolean' | 'struct' | 'any'
  /** 属性的别名 */
  alias?: string
}

export type MetaAttr = keyof PageMetadata

export interface WidgetEditableProps {
  // title: WidgetEditablePropMeta
  [propName: string]: WidgetEditablePropMeta
}

export type PropItemCompRender = ({
  /** 属性的值 */
  propItemValue,
  /** onChange 事件 */
  onChange,
  /** 表达式助手，由属性项自身决定是否使用 */
  fxHelper,
}) => JSX.Element

export interface NextEntityState {
  /** 目标属性 */
  attr: string
  /** 属性的值 */
  value: any
}

export type NextEntityStateType = NextEntityState | NextEntityState[]

export type ChangeEntityState = (nextEntityState: NextEntityStateType) => void

export interface TakeMetaOptions {
  /** meta 的 attr */
  metaAttr: MetaAttr
  /** meta 的引用 ID */
  metaRefID?: string
}

export type TakeMeta = (options: TakeMetaOptions) => unknown

export type GenMetaRefID = (
  /** 编辑的 meta 属性 */
  metaAttr: MetaAttr,
  /** 生成的 options */
  options?: {
    /** 生成的 metaID */
    len?: number
    /** 额外的 meta id 信息 */
    extraInfo?: string
  }
) => string


/** TODO: 完善属性项渲染器上下文的存放 */
export interface PropItemRenderContext {
  /** 业务数据 */
  businessPayload: PD.PropItemRendererBusinessPayload
  /** 编辑中的组件实例 */
  readonly widgetEntity: WidgetEntity
  /** 组件实例状态 */
  readonly editingWidgetState: any
  /** 更改组件实例状态的接口 */
  changeEntityState: ChangeEntityState
  /** 更改页面的 meta 数据 */
  changeMetadata: typeof ChangeMetadata
  /** 获取 meta */
  takeMeta: TakeMeta
  /** 生成 meta 引用的 ID */
  genMetaRefID: GenMetaRefID
}

/**
 * 属性项
 * @description 节点含义说明：第一层为描述属性项的元数据，propItemCompDef 节点为描述该属性项中用于交互的组件
 */
export interface PropItemMeta {
  /** 属性项 ID，随机生成的 */
  readonly id: string
  /** 被 widget 引用的属性名字 */
  readonly name: string
  /** 属性项显示的 label */
  readonly label: string
  /**
   * 1. 需要编辑的组件实例状态的哪些属性；
   * 2. 如果指定的是数组，则传入到属性项的 widgetEntityState 为包含所有定义的对象结构；
   * 3. 可以被组件元数据的 editAttr 定义覆盖；
   */
  readonly whichAttr: string | string[]
  /** 是否使用 meta */
  readonly useMeta?: MetaAttr | MetaAttr[]
  /**
   * 1. 属性项给予组件实例的默认值
   * 2. 会被组件元数据的 defaultValues 中覆盖
   */
  readonly defaultValue?: any
  /** 多个属性的默认值 */
  readonly defaultValues?: {
    [whichAttr: string]: any
  }
}

export interface PropItemRender {
  /** 渲染属性项 */
  render(propItemRenderCtx: PropItemRenderContext): JSX.Element
}
