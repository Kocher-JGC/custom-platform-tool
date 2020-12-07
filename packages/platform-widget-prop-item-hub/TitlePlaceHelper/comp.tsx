import React from "react";
import { Select } from "antd";
import { PLACE_MENU } from "./constants";

export const TitlePlaceComp = ({ editingWidgetState, onChange }) => {
  const { titlePlace } = editingWidgetState;
  return (
    <Select
      style={{ width: "100%" }}
      defaultValue={titlePlace}
      value={titlePlace}
      onChange={(value) => onChange(value)}
      options={PLACE_MENU}
    />
  );
};
