/**
 * 在 form 表单中有标题的 Input 组件
 */
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Input, Form } from "antd";

/**
 * FormInput 必须的 props
 */
export interface FormInputCompProps {
  title: string;
  /** 默认值 */
  realVal: string;
  showVal?: string;
  labelColor: string;
  onChange: any;
}

/**
 * 受控组件Value无法输入中午问题
 * innerVal + relVal + DOMEvent Composition 解决
 * todo: 未完成的
 */
const useInputOnChange = (val, onChange) => {
  // const innerVal relValue
  const [state, setState] = useState(val);
  useEffect(() => {
    setState(val);
  }, [val]);
  const eventProps = useMemo(() => {
    let isOnComposition = false;
    if (!onChange) return {};
    const handleOnComposition = (e) => {
      console.log(e);
      console.log(e.target.value);
      if (e.type === "compositionend") {
        isOnComposition = false;
        if (!isOnComposition) {
          onChange(e);
        }
      } else {
        isOnComposition = true;
      }

      setState(e.target.value);
    };

    return {
      onCompositionStart: handleOnComposition,
      onCompositionUpdate: handleOnComposition,
      onCompositionEnd: handleOnComposition,
    };
  }, [onChange]);

  return {
    // setState,
    value: state,
    ...eventProps,
  };
};

export const FormInputComp: React.FC<FormInputCompProps> = (props) => {
  const { title, labelColor, showVal, realVal, onChange } = props;
  const [state, setState] = useState(showVal || realVal);
  useEffect(() => {
    setState(showVal || realVal);
  }, [realVal, showVal]);

  const actualOnChange = useCallback((e) => {
    setState(e.target.value);
    onChange?.(e);
  }, []);
  return (
    <div>
      <div
        style={{
          color: labelColor,
        }}
      >
        {title}
      </div>
      <Input
        disabled={!!showVal}
        /** TODO: useInputOnChange 未完成, 临时使用d先用着 */
        style={{ width: 300 }}
        onChange={actualOnChange}
        value={state}
      />
    </div>
  );
};
