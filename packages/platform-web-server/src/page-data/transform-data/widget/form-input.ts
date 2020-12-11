import { changeStateAction, genDefalutFlow } from "../task";
import { TransfromCtx } from "../../types/types";
import { splitMark, schemaMark, ref2ValMark } from "../IUBDSL-mark";
import { defaultGenEvents } from "./default-gen";

const template = (ref2ValId: string, key: string) => ({
  ref2ValId,
  type: 'structObject',
  struct: [
    {
      val: '@(runCtx).payload', // 来源: 固定值, 表达式, 后端数据
      key, // 目标: 页面变量的标示位
    }
  ]
});

const genInputEvents = (transfromCtx: TransfromCtx, widgetConf) => {
  const { id, propState } = widgetConf;
  let { eventRef = {} } = propState;
  const { schema, extralDsl: { tempAction, tempFlow, tempRef2Val } } = transfromCtx;

  if (!eventRef) eventRef = {};

  /** 找到当前widget的schema描述 */
  const widgetSchema: any = Object.values(schema).find((val: any) => val?.widgetRef ===  id);
  if (widgetSchema) {
    /**
     * 1. 设置默认值
     * 2. 添加 @(schema). 引用
     * 3. 生成onChange动作 {ref2Val\action\flow}
     */
    if (widgetSchema?.struct?.realVal) {
      const { schemaRef } = widgetSchema;
      // 设置默认值
      widgetSchema.struct.realVal.defaultVal = propState?.realVal;
      // console.log(widgetSchema.struct.realVal);
      // console.log(propState?.realVal);
      
      // const changeRef = `${schemaMark + schemaRef}`;
      const changeRef = `${schemaMark + schemaRef + splitMark}realVal`;
      /** 添加 @(schema). 引用 */
      propState.realVal = changeRef;
      /** 生成ref2Val */
      const ref2ValMarkToUse = ref2ValMark + id;
      const ref2Val = template(id, changeRef);
      tempRef2Val.push(ref2Val);
      /** 更改状态的动作 */
      tempAction.push(changeStateAction(transfromCtx, id, ref2ValMarkToUse));
      /** 更改状态的流程项 */
      const defFlow = genDefalutFlow(id);
      tempFlow.push(defFlow);
      /** 生成onChange动作 */
      if (eventRef?.onChange) {
        if (Array.isArray(eventRef.onChange)) {
          eventRef.onChange.unshift(defFlow.id);
        }
      } else {
        eventRef.onChange = [defFlow.id];
      }
    }

  }

  return defaultGenEvents(eventRef);
};


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
export const genFormInput = (transfromCtx: TransfromCtx, widgetConf) => {
  const { id, widgetRef, propState } = widgetConf;
  const { widgetCode } = propState;

  const eventHandleToUse = genInputEvents(transfromCtx, widgetConf);

  return {
    widgetId: id, widgetRef, propState, widgetCode,
    eventHandlers: {
      ...eventHandleToUse
    },
  };
};