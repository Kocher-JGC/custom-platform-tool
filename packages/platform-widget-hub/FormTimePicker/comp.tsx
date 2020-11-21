/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

/**
 * FormInput 必须的 props
 */
export interface FormTimePickerCompProps {
  title: string
  /** 默认值 */
  realVal: string
  labelColor: string
}

export const FormTimePickerComp: React.FC<FormTimePickerCompProps> = (props) => {
  const {
    title,
    labelColor,
    realVal,
  } = props;

  const params = Object.assign({}, {
    style: { width: 300 },
    showTime: true,
    placeholder: ""
  },realVal && { value:moment(realVal) });

  return (
    <div>
      <div
        style={{
          color: labelColor
        }}
      >
        {title}
      </div>
      <DatePicker {...params} />
    </div>
  );
};
