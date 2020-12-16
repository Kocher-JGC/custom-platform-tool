import { TransfromCtx } from "../../types";
import { splitMark, interMetaMark } from "../IUBDSL-mark";
import { defaultGenEvents, genWidgetErrLogFn } from "./default-gen";
import { genChangePropsAndSetCtx } from "../tools";

/**
 * 1. 将widget的默认值给到schema, 并绑定schema
 * 2. 生成onChange事件/动作
 * 3. 绑定和记录field
 */
const genInputEvents = (transfromCtx: TransfromCtx, widgetConf) => {
  const { id, propState, } = widgetConf;
  let { eventRef = {} } = propState;
  const {
    logger ,schema, metaSchema, extralDsl: {  pageFieldsToUse } 
  } = transfromCtx;
  const printErrLog = genWidgetErrLogFn(logger, id);

  if (!eventRef) eventRef = {};

  /** 找到当前widget的schema描述 */
  const widgetSchema: any = Object.values(schema).find((val: any) => val?.widgetRef ===  id);
  if (widgetSchema) {
    /** 目前写死真实值 */
    if (widgetSchema?.struct?.realVal) {
      // 设置默认值
      widgetSchema.struct.realVal.defaultVal = propState?.realVal;
      widgetSchema.struct.showVal.defaultVal = propState?.realVal;
      /** 添加 @(schema). 引用 */
      const setTarget = widgetSchema.struct.realVal.schemaRef;
      propState.realVal = setTarget;
      
      /** 生成改变props的相关内容 */
      const { flow } = genChangePropsAndSetCtx(transfromCtx, id, setTarget);
      /** 添加onChange事件 */
      if (eventRef?.onChange) {
        if (Array.isArray(eventRef.onChange)) {
          eventRef.onChange.unshift(flow.id);
        } else {
          printErrLog(JSON.stringify(eventRef.onChange));
        }
      } else {
        eventRef.onChange = [flow.id];
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
          pageFieldsToUse.push({ tableId , fieldId, schemaRef: setTarget });
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