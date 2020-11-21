/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from 'react';
import { InputNumber } from 'antd';

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
  realVal: number,
  labelColor: string
}

export const FormInputNumberComp: React.FC<FormInputNumberCompProps> = (props) => {
  const {
    title,
    labelColor,
    realVal,
    min,
    max,
    radixPoint
  } = props;

  return (
    <div>
      <div
        style={{
          color: labelColor
        }}
      >
        {title}
      </div>
      <InputNumber min={min} max={max} decimalSeparator={radixPoint} value={realVal} style={{ width: 300 }} />
    </div>
  );
};
