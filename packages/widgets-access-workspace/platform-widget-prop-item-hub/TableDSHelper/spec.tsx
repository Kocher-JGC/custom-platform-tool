import React from "react";
import { PropItem, PropItemRenderContext } from "@platform-widget-access/spec";
import { TableDSHelperComp } from "./comp";

/** 属性项编辑的组件属性 */
// const whichAttr = 'title';

@PropItem({
  id: "prop_table_ds_helper",
  label: "选择数据源",
  whichAttr: ["ds", "columns", "sortInfo"],
  useMeta: ["dataSource"],
})
export class TableDSHelperSpec {
  render(ctx: PropItemRenderContext) {
    return <TableDSHelperComp {...ctx} whichAttr="ds" />;
  }
}
