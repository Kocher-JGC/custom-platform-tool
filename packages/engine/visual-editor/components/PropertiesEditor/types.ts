import { ChangeEntityState, PropItemMeta } from "../../data-structure";

/**
 * 属性项的渲染器标准接口
 */
export interface PropItemRendererProps {
  propItemConfig: PropItemMeta
  /** 属性项的值 */
  propItemValue
  /** 属性项的 onChange 回调 */
  onChange: ChangeEntityState
}
