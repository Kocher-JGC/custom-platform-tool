/**
 * 在 form 表单中有标题的 Input 组件
 */
import React, { useCallback } from 'react';
import { Input } from 'antd';

/**
 * FormInput 必须的 props
 */
export interface FormInputCompProps {
  title: string
  /** 默认值 */
  realVal: string
  labelColor: string
  onChange: any;
}

export const FormInputComp: React.FC<FormInputCompProps> = (props) => {
  const {
    title,
    labelColor,
    realVal,
    onChange
  } = props;

  const actualOnChange = useCallback((e) => { onChange?.(e); }, []);

  return (
    <div>
      <div
        style={{
          color: labelColor
        }}
      >
        {title}
      </div>
      <Input 
        value={realVal} style={{ width: 300 }}
        onChange={actualOnChange}
      />
    </div>
  );
};
