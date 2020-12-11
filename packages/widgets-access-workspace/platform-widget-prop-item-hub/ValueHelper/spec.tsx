import React from "react";
import { PropItem, PropItemRenderContext } from "@platform-widget-access/spec";
import { ValueHelper } from "./comp";

@PropItem({
  id: "prop_real_value",
  label: "值",
  whichAttr: ["realVal", "exp", "variable"]
})
export class ValueHelperSpec {
  render(ctx: PropItemRenderContext) {
    const { changeEntityState, editingWidgetState } = ctx;
    return (
      <ValueHelper
        {...ctx}
        onChange={changeEntityState}
        editingWidgetState={editingWidgetState}
      />
    );
  }
}
