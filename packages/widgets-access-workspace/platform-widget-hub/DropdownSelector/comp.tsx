/**
 * 在 form 表单中有标题的 Input 组件
 */
import React, { useCallback } from "react";
import { Select, message } from "antd";

function handleButtonClick(e) {
  message.info("Click on left button.");
  console.log("click left button", e);
}

export const DropdownSelectorComp = ({
  widgetCode,
  title,
  realVal,
  showVal,
  dataSource = [],
  showKey = "showVal",
  valueKey = "realVal",
  labelColor,
  onPropsChange,
}) => {
  const actualOnChange = useCallback(
    (changeVal) => {
      const data = dataSource.find((d) => d[valueKey] === changeVal);
      if (data) {
        onPropsChange?.([
          {
            propsKey: "showVal",
            val: data[showKey],
          },
          {
            propsKey: "realVal",
            val: data[valueKey],
          },
        ]);
      }
    },
    [dataSource]
  );

  return (
    <div key={widgetCode}>
      <div
        style={{
          color: labelColor,
        }}
      >
        {title}
      </div>
      <Select onChange={actualOnChange} value={realVal} style={{ width: 120 }}>
        {dataSource.map((d, idx) => (
          <Select.Option key={d[valueKey] + idx} value={d[valueKey]}>
            {d[showKey]}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
