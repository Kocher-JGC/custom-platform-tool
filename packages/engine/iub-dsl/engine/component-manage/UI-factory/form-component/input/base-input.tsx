import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { BaseInputProps, InputProps } from './i-base-input';
import { assertPropsKey, basePickPropsCstr, basePropsMapCstr } from '../../utils';
import { AllUI } from '../../types';

/**
 * 应用端组件开发标准
 */

/**
 * IUB-DSL组件描述上的A属性由真实组件的B属性实现
 */
export const baseInputPropsMapList = {
  unit: 'suffix',
  placeholder: 'placeholder',
  value: 'value,'
};
export const baseInputPropsKes = Object.keys(baseInputPropsMapList);

const pickBaseInputPropsKey = basePickPropsCstr(baseInputPropsKes);

const baseInputPropsMap = basePropsMapCstr<InputProps>(baseInputPropsMapList);
export const baseInputCompName = AllUI.BaseInput;

/**
 * 输入框组件的工厂函数,
 * 根据不同的props生产不同的Input
 * 受控的傻瓜组件
 * @param param0 BaseInputProps
 */
export const BaseInputFactory: React.FC<BaseInputProps> = React.memo(
  ({
    value, onChange, id = '', ...ohterProps
  }) => {
    /** 下面三步确保props全部正确可用 */
    const allPropsKey = Object.keys(ohterProps);
    const canUsePropsKey = pickBaseInputPropsKey(allPropsKey);
    const actualProps: InputProps = baseInputPropsMap(ohterProps, canUsePropsKey);
    /** 必要的断言 */
    assertPropsKey(id, allPropsKey, canUsePropsKey);

    /** TODO: 个人觉得应该为受控组件, 怎么修改都应该是外部确定的 */
    // const [normalInputVal, setnormalInputVal] = useState(value || '');
    // useEffect(() => {
    //   setnormalInputVal(value);
    // }, [value]);

    return (
      <Input
        style={{ width: 300 }}
        defaultValue={value}
        // value={value}
        // value={normalInputVal}
        key={id}
        onChange={(e) => {
          // setnormalInputVal(e.target.value);
          onChange?.(e);
        }}
        {...actualProps}
      />
    );
  }
);
