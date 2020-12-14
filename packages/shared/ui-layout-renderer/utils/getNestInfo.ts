import { ElemNestingInfo } from "../types";

/**
 * 获取自身在父级中的 idx 信息
 */
export const getItemIdx = (nestingInfo: ElemNestingInfo) => {
  return [...nestingInfo].pop();
};

/**
 * 获取 item 的父 idx 信息
 */
export const getItemParentIdx = (nestingInfo: ElemNestingInfo) => {
  const _ = [...nestingInfo];
  _.pop();
  return _;
};
