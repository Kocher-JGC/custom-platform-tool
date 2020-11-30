// TODO: 是否需要区分不同的widget

/**
 * 1. 通过某种结构在解析的时候区分是否为静态
 * 2. 针对不同的类型进行采用不同增强器解析/运行
 * 3. UI接入的时候将统一的props, 转换成为真实组件使用的props
 */

/** 直接引用 action */
export type ActionDirectType = {
  type: "direct";
  func: "Action";
};

/** 从 action collection 中引用 action */
export type FlowRefType = {
  type: "flowEventHandler";
  /** 引用的子流程的id */
  flowItemIds: string[];
  /** 引用的页面，如果没有，则代表当前页 */
  pageID?: string;
}

export type ActionTypeDef = ActionDirectType | FlowRefType;

export interface WidgetEvents {
  onMount?: ActionTypeDef;
  onUnmount?: ActionTypeDef;
  /** 鼠标点击 */
  onClick?: ActionTypeDef;
  /** 移动端手势处罚 */
  onTap?: ActionTypeDef;
  /** 值改变时的回调 */
  onChange?: ActionTypeDef;
  /** 获取焦点时的回调 */
  onFocus?: ActionTypeDef;
}

// export type UserBehavior =
//   | "onClick"
//   | "onChange"
//   | "onUserChange"
//   | "onFocus"
//   | "onBlur";
// export type Lifecycles = "onMount" | "onUnmount";

export type TriggerEventTypes = keyof WidgetEvents;
