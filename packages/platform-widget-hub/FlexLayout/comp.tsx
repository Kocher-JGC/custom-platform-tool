/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from 'react';
import { Input } from 'antd';

/**
 * FormInput 必须的 props
 */
export interface FlexLayoutCompProps {
  title: string
  /** 默认值 */
  realVal: string
  labelColor: string
}

export const FlexLayoutComp: React.FC<FlexLayoutCompProps> = (props) => {
  const {
    children
  } = props;

  return (
    <div
      style={{
        minHeight: 100,
      }}
      className="bg_default"
    >
      {children}
    </div>
  );
};
