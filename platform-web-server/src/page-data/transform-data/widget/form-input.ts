import { changeStateAction, genDefalutFlow, payloadRef2ValTemplate } from "../task";
import { TransfromCtx } from "../../types/types";
import { splitMark, schemaMark, ref2ValMark, interMetaMark, runCtxPayloadMark } from "../IUBDSL-mark";
import { defaultGenEvents } from "./default-gen";

const genInputEvents = (transfromCtx: TransfromCtx, widgetConf) => {
  const { id, propState, } = widgetConf;
  let { eventRef = {} } = propState;
  const { 
    schema, metaSchema, extralDsl: {
      tempAction, tempFlow, tempRef2Val, pageFieldsToUse
    } 
  } = transfromCtx;

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
      
      // const changeRef = `${schemaMark + schemaRef}`;
      const changeRef = `${schemaMark + schemaRef + splitMark}realVal`;
      /** 添加 @(schema). 引用 */
      propState.realVal = changeRef;
      /** 生成ref2Val */
      const ref2ValMarkToUse = ref2ValMark + id;
      const ref2Val = payloadRef2ValTemplate(id, changeRef);
      tempRef2Val.push(ref2Val);
      /** 更改状态的动作 */
      tempAction.push(changeStateAction(id, ref2ValMarkToUse));
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

      /**
       * 1. 记录组件实际使用的field信息
       * 2. 组件使用了哪个元数据
       *   作用: 整表回写/读取的依赖收集
       */
      if (propState.field) {
        const metaSchemaInfo = metaSchema[propState.field];
        if (metaSchemaInfo) {
          const tableId = metaSchemaInfo.tableInfo.id;
          const fieldId = metaSchemaInfo.column.id;
          propState.field = interMetaMark + tableId + splitMark + fieldId;       
          pageFieldsToUse.push({ tableId , fieldId, schemaRef: changeRef });
        }
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