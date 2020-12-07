/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from "react";
import { InputNumber } from "antd";

/**
 * FormInput 必须的 props
 */
export interface FormInputNumberCompProps {
  title: string;
  max: number;
  min: number;
  radixPoint: string;
  noteInfo: string;
  promptInfo: string;
  /** 默认值 */
  realVal: number | string;
  labelColor: string;
}

export const FormInputNumberComp: React.FC<FormInputNumberCompProps> = (props) => {
  const { title, labelColor, realVal, min, max, radixPoint } = props;
  const compProps = Object.assign(
    {},
    typeof min === "number" && Number(radixPoint) >= 0 && { radixPoint },
    typeof min === "number" && { min },
    typeof max === "number" && { max },
    (realVal || realVal === 0) && Number(realVal) && { value: Number(realVal) }
  );

  return (
    <div>
      <div
        style={{
          color: labelColor
        }}
      >
        {title}
      </div>
      <InputNumber {...compProps} style={{ width: 300 }} />
    </div>
  );
};
