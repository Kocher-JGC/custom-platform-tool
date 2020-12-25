import { pageData2IUBDSL } from "./transform-to-IUBDSL";
import { TransfromCtx } from "../types";

export const genPageDataSource = (dsIds: string[]) => dsIds.reduce(
  (res, id) => ({ ...res, [id]: { id } }), 
  {}
);
const initPageMetaData = ({ dsIds }: { dsIds: string[] }) => ({
  dataSource: genPageDataSource(dsIds), 
  varRely: {
    'var.pageInput.0.mode': {
      code: "var.page.mode",
      realVal: "insert",
      title: "页面模式",
      type: "pageInput",
      varType: "string",
    }
  },
  schema: {}, actions: {}, events: {}
});

const genSelectDataTableWideget = ({ id, ds, columns, title }) => {
  return {
    label: "表格",
    widgetRef: "NormalTable",
    wGroupType: "dataDisplay",
    id,
    propState: {
      widgetCode: `SelectDataModal.${id}`,
      ds, columns, title,
      // [ "1337304350342656000" ],
      sortInfo: null,
      titleAlign: "left",
      defaultPageSize: 10,
      showOrderColumn: false,
      wordWrap: false,
      rowCheckType: "single",
      checkedRowsStyle: "checkCell",
      eventRef: null,
      queryType: {
        typical: {
          queryStyle: "asForm"
        }
      },
      typicalQueryList: null,
      specialQueryList: null,
      keywordQueryList: null
    },
    nestingInfo: [
      2
    ]
  };
};

/**
 * 弹窗选择页面「表格」
 * 1. ds、schema
 * 2. wideget
 */
export const genSelectPage = async (transfromCtx: TransfromCtx, { dsIds, id, columns, title }) => {
  const { logger, getRemoteTableMeta } = transfromCtx;
  const pageContent = {
    id: `${id}_selectData`,
    name: '数据选择页面',
    meta: initPageMetaData({ dsIds }),
    content: [genSelectDataTableWideget({ id, ds: dsIds, columns, title })],
  };

  const pageData = {
    pageContent: JSON.stringify(pageContent)
  };

  const IUBPage = await pageData2IUBDSL(pageData, { logger, getRemoteTableMeta });
  Reflect.deleteProperty(IUBPage.widgetCollection ,'defaultDelTableBtn');
  Reflect.deleteProperty(IUBPage.actionsCollection ,'defaultDelTableBtn');
  Reflect.deleteProperty(IUBPage.flowCollection ,'f_defaultDelTableBtn');
  Reflect.deleteProperty(IUBPage.APIReqCollection ,'req_defaultDelTableBtn');
  
  return IUBPage;
};
