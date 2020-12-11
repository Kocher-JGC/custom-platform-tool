/**
 * 在 form 表单中有标题的 Input 组件
 */
import React, { useCallback } from 'react';

/**
 * FormInput 必须的 props
 */
export interface TextareaCompProps {
  title: string
  /** 默认值 */
  realVal: string
  labelColor: string
  onChange: any
}

export const TextareaComp: React.FC<TextareaCompProps> = (props) => {
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
      <textarea value={realVal} onChange={actualOnChange} style={{ width: 300 }} />
    </div>
  );
};
