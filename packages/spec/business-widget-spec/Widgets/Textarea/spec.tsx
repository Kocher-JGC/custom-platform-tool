import React from 'react';
import { TextareaComp } from '.';
import { BusinessWidgetAccessSpec } from '../../interfaces';

export const Textarea: BusinessWidgetAccessSpec = () => ({
  name: 'Textarea',

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
      <TextareaComp {...widgetState} />
    );
  }
});
