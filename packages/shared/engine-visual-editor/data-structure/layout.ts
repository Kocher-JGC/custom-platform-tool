// import { ElemNestingInfo } from '@engine/layout-renderer/types/layout-node-info';
import { ElemNestingInfo } from "@engine/layout-renderer";
import { WidgetEntity } from "./widget";

// export {
//   ElemNestingInfo
// };

/**
 * state 的数据结构
 */
export type LayoutInfoActionReducerState = WidgetEntity[]

interface FlatLayoutItem extends WidgetEntity {
  nestingInfo: ElemNestingInfo
}

export interface FlatLayoutItems {
  [entityID: string]: FlatLayoutItem
}
