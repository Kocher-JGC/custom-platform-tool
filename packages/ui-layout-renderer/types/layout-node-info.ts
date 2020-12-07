/**
 * @author zxj
 */

/**
 * 用于记录布局节点信息的数据结构
 */
export interface LayoutNodeItem {
  /** id */
  id: string;
  /** 子布局内容 */
  body?: LayoutNodeItem[]
}

/**
 * 选中的组件实例 index，采用数组嵌套结构
 * 1. 例如 [0] 代表最外层的第 0 个元素中进行排序
 * 2. 例如 [0, 1, 2] 代表最外层第 0 个元素中的第 1 个元素中的第 2 个元素
 */
export type ElemNestingInfo = number[]
