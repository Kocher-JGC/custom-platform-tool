import React from 'react';
import { FormInputComp } from '.';
import { BusinessWidgetAccessSpec } from '../../interfaces';

export const FormInput: BusinessWidgetAccessSpec = () => ({
  name: 'FormInput',

  editableProps: {
    title: {
      type: 'string'
    },
    labelColor: {
      type: 'string'
    },
    defValue: {
      type: 'string'
    },
  },

  render(widgetState) {
    return (
      <FormInputComp {...widgetState} />
    );
  }
});
