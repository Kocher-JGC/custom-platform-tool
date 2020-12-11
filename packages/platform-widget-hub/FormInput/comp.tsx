/**
 * 在 form 表单中有标题的 Input 组件
 */
import React, { useCallback, useState, useMemo } from 'react';
import { Input, Form } from 'antd';

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

/**
 * 受控组件Value无法输入中午问题
 * innerVal + relVal + DOMEvent Composition 解决
 * todo: 未完成的
 */
const useInputOnChange = (val, onChange) => {
  // const innerVal relValue
  const eventProps = useMemo(() => {
    let isOnComposition = false;
    if (!onChange) return {};
    const handleOnComposition = (e) => {
      if (e.type === 'compositionend') {
        isOnComposition = false;
        if (!isOnComposition) {
          onChange(e);
        }
      } else {
        isOnComposition = true;
      }
    };

    return {
      onCompositionStart: handleOnComposition,
      onCompositionUpdate: handleOnComposition,
      onCompositionEnd: handleOnComposition,
    };
  }, [onChange]);

  return {
    value: state,
    ...eventProps
  };

};

export const FormInputComp: React.FC<FormInputCompProps> = (props) => {
  const {
    title,
    labelColor,
    realVal,
    onChange
  } = props;
  
  // const changeEventProps = useInputOnChange(realVal, onChange);
  const actualOnChange = useCallback((e) => { 
    onChange?.(e);
  }, []);
  const pp = useMemo(() => {
    if (realVal !== undefined) {
      return {
        defaultValue: realVal
      };
    }
    return {};
  }, [realVal]);
  // console.log(pp);

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
        {...pp}
        style={{ width: 300 }}
        onChange={actualOnChange}
        /** TODO: useInputOnChange 未完成, 临时使用defalutVal 先用着 */
        // value={realVal}
        // {...changeEventProps}
      />
    </div>
  );
};
