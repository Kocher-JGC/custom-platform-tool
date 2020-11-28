import React from "react";
import { PropItem } from "@platform-widget-access/spec";
import { ValueHelper } from "./comp";

@PropItem({
  id: "prop_real_value",
  name: "PropValue",
  label: "值",
  whichAttr: ["realVal", "exp", "variable"]
})
export class ValueHelperSpec {
  render(ctx) {
    const { changeEntityState, editingWidgetState } = ctx;
    return <ValueHelper onChange={changeEntityState} editingWidgetState={editingWidgetState} />;
  }
}
