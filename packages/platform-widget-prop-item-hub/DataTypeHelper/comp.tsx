import React, { useEffect } from "react";
import { Select } from "antd";
import { FIELD_TYPE_MENU } from "./constants";

const { Option } = Select;

export const DataTypeComp = ({ changeEntityState, editingWidgetState, takeMeta }) => {
  const { dataType, field } = editingWidgetState;
  const selectedField = takeMeta({
    metaAttr: "schema",
    metaRefID: field
  });
  useEffect(() => {
    // const NextDataType = selectedField?.column?.name;
    // if (!NextDataType || NextDataType === dataType) return;
    // changeEntityState({
    //   attr: "dataType",
    //   value: NextDataType
    // });
  }, [selectedField]);
  return (
    <Select
      style={{ width: "100%" }}
      value={dataType}
      onChange={(value) =>
        changeEntityState({
          attr: "dataType",
          value
        })
      }
    >
      {FIELD_TYPE_MENU.map((item) => (
        <Option key={item.key} value={item.value}>
          {item.label}
        </Option>
      ))}
    </Select>
  );
};
