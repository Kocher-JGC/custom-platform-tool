import { DEFALUT_FLOW_MARK, changeStateAction, genDefalutFlow } from "../task";
import { TransfromCtx } from "../types";

export const genFormInputDefaltAction = (widgetId: string) => ({
  onChange: {
    type: 'actionRef',
    actionID: `@(flow).${DEFALUT_FLOW_MARK}${widgetId}`
  }
});

// {
//   widgetId: string;
//   /** UI隔离的唯一引用标识 */
//   widgetRef: AllWidgetType;
//   /** widget唯一编码 */
//   widgetCode: string;
//   // type: "component";
//   /**
//    * 组件触发的事件定义
//   */
//   eventHandlers?: WidgetEvents;
//   /** Widget的prop定义 */
//   propState: any;
// }


/** 生成输入框widget */
export const genFormInput = (transfromCtx: TransfromCtx, { id, widgetRef, propState }) => {
  const { title, widgetCode, labelColor, realVal, exp, variable } = propState;
  const { 
    extralDsl: { tempAction, tempFlow, tempSchema }
  } = transfromCtx;
  // let { field } = propState;
  // if (!field) {
  //   field = id;
  //   tempSchema.push({
  //     name: widgetCode,
  //     schemaId: id,
  //     type: 'string',
  //     fieldCode: '',
  //     fieldMapping: '',
  //   });
  // }
  /** 更改状态的动作 */
  // tempAction.push(changeStateAction(transfromCtx, id, `@(schema).${field}`));
  /** 更改状态的流程项 */
  tempFlow.push(genDefalutFlow(id));
  return {
    widgetId: id, widgetRef, propState, widgetCode,
    eventHandlers: {
      ...genFormInputDefaltAction(id)
    },
  };
};