/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from 'react';
import { Input } from 'antd';

/**
 * FormInput 必须的 props
 */
export interface TextareaCompProps {
  title: string
  /** 默认值 */
  realVal: string
  labelColor: string
}

export const TextareaComp: React.FC<TextareaCompProps> = (props) => {
  const {
    title,
    labelColor,
    realVal,
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
      <textarea value={realVal} style={{ width: 300 }} />
    </div>
  );
};
