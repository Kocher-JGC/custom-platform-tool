import { genNormanTable, genFromButton, genFormInput, defaultGen } from "./widget";
import { TransfromCtx } from "./types";

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
  return sourceData.map(nodeInfo => {
    const { id, widgetRef, propState, varAttr } = nodeInfo;
    return genOnceWidgetConf(transfromCtx, { id, widgetRef, propState });
  });

};
