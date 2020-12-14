import { PageVariableOfTable } from "@iub-dsl/definition/page-variable";
import { PageCommunication } from "@iub-dsl/definition";
import { RunTimeCtxToBusiness, DispatchModuleName, DispatchMethodNameOfIUBStore } from "../runtime/types";

export const genPageVariableOfTable = ({
  table,
  compMark,
  widgetId
}, {
  PK, metaDataRef
}): PageVariableOfTable => {
  return {
    widgetId,
    compMark,
    varType: 'TableGrid',
    valueInfo: {
      ...table,
      PK,
    },
    metaDataRef,
  };
};

export const genPageCommunication = ({
  pageInfo,
  metadata,
  variableData
}): PageCommunication => {
  return {
    pageInfo,
    metadata,
    variableData
  };
};

/**
 * 页面通讯, 单条记录的回填
 */
const handleF = ({ asyncDispatchOfIUBEngine }: RunTimeCtxToBusiness, pageVar: PageVariableOfTable, metadata) => {
  const { metaDataRef, valueInfo: { rowData } } = pageVar;
  asyncDispatchOfIUBEngine({
    dispatch: {
      module: DispatchModuleName.IUBStore,
      method: DispatchMethodNameOfIUBStore.updatePageStateFromTableRecord,
      params: [rowData, metadata[metaDataRef[0]]]
    }
  });
};
export const pageCommunicationReceiver = (ctx: RunTimeCtxToBusiness, info: PageCommunication) => {
  const { pageInfo, metadata, variableData } = info;
  variableData.forEach((item) => {
    switch (item.varType) {
      case 'TableCol':
      case 'TableGrid':
      case 'TableRow':
        handleF(ctx, item, metadata);
        break;
      default:
        break;
    }
  });
};
