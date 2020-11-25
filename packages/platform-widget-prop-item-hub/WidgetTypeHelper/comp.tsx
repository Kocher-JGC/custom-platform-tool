import React, { useEffect } from "react";
import { Select } from "antd";
import { FIELD_TYPE_MENU } from "./constants";

const { Option } = Select;

export const WidgetTypeComp = ({ changeEntityState, editingWidgetState, takeMeta }) => {
  const { widgetType, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: "schema",
    metaRefID: field
  });
  useEffect(() => {
    const { name, fieldType, fieldSize } = selectedField?.column || {};

    changeEntityState({
      attr: "title",
      value: name
    });

    changeEntityState({
      attr: "dataType",
      value: fieldType
    });

    changeEntityState({
      attr: "stringLength",
      value: fieldSize
    });

  }, [selectedField]);
  return (
    <Select
      style={{ width: "100%" }}
      value={widgetType}
      onChange={(value) =>
        changeEntityState({
          attr: "widgetType",
          value
        })
      }
    >
      {FIELD_TYPE_MENU.map((item) => (
        <Option key={item.key} value={item.value} disabled={!item.value}>
          {item.label}
        </Option>
      ))}
    </Select>
  );
};
