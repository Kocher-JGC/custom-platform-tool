import { genNormanTable, genFromButton, genFormInput, defaultGen } from "./widget";
import { TransfromCtx } from "../types/types";

const genOnceWidgetConf = (transfromCtx: TransfromCtx, { id, widgetRef, propState }) => {
  let widgetConf = null;
  switch (widgetRef) {
    case 'FormInput':
      widgetConf = genFormInput(transfromCtx, { id, widgetRef, propState });
      break;
    case 'FormButton':
      widgetConf = genFromButton(transfromCtx, { id, widgetRef, propState });
      break;
    case 'NormalTable':
      widgetConf = genNormanTable(transfromCtx, { id, widgetRef, propState });
      break;
    default:
      return defaultGen(transfromCtx, { id, widgetRef, propState });
  }
  return widgetConf;
};


export const genWidgetFromPageData = (transfromCtx: TransfromCtx, sourceData: any[]) => {
  const res: any[] = [];
  sourceData.forEach(nodeInfo => {
    const { id, widgetRef, propState, varAttr } = nodeInfo;
    const conf = genOnceWidgetConf(transfromCtx, { id, widgetRef, propState });
    // eslint-disable-next-line no-unused-expressions
    Array.isArray(conf) ? res.push(...conf) : res.push(conf);
  });
  return res;
};
