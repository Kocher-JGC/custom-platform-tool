import React from 'react';
import { Form } from 'antd';
import { FormProps } from 'antd/lib/form';
import { AllUI } from '../../types';

const fromWrapCompName = AllUI.FromWrap;
const FromWrapFactory: React.FC<FormProps> = ({ children, isSearch, ...props }) => {
  return (
    <Form
      layout={isSearch ? "inline" : "vertical"}
      {...props}
    >
      {children}
    </Form>
  );
};

export { FromWrapFactory, fromWrapCompName };
