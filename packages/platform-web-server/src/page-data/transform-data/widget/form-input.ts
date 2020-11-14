import { DEFALUT_FLOW_MARK, updateStateAction, genDefalutFlow } from "../task";
import { TransfromCtx } from "../types";

export const genFormInputDefaltAction = (widgetId: string) => ({
  onChange: {
    type: 'actionRef',
    actionID: `@(flow).${DEFALUT_FLOW_MARK}${widgetId}`
  }
});

/** 生成输入框widget */
export const genFormInput = (transfromCtx: TransfromCtx, { id, widgetRef, propState }) => {
  const { title, widgetCode, labelColor, realVal, exp, variable } = propState;
  const { 
    extralDsl: { tempAction, tempFlow, tempSchema }
  } = transfromCtx;
  let { field } = propState;
  if (!field) {
    field = id;
    tempSchema.push({
      name: widgetCode,
      schemaId: id,
      type: 'string',
      fieldCode: '',
      fieldMapping: '',
    });
  }
  /** 更改状态的动作 */
  tempAction.push(updateStateAction(transfromCtx, id, `@(schema).${field}`));
  /** 更改状态的流程项 */
  tempFlow.push(genDefalutFlow(id));
  return {
    id,widgetId: id, widgetRef, labelColor,
    label: title, title, value: `@(schema).${field}`,
    defValue: realVal,
    actions: {
      ...genFormInputDefaltAction(id)
    }
    // unit, placeholder, tipContent
  };
};