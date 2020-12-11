/**
 * 在 评分 组件
 */
import { Rate } from 'antd';
import React from 'react';

export interface RateCompProps {
  title?: string
  /** 默认值 */
  numberVal: number
  labelColor?: string
}

export const RateComp: React.FC<RateCompProps> = (props) => {
  const {
    title,
    labelColor,
    numberVal,
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
      <Rate allowHalf defaultValue={numberVal} />
    </div>
  );
};
