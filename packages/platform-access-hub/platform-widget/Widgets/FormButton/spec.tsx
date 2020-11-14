import React from 'react';
import { FormButtonComp } from '.';
import { PlatformWidget, PlatformWidgetComp } from '../../core';

@PlatformWidget({
  name: 'FormButton',
  editableProps: {
    title: {
      type: 'string'
    },
  },
})
export class FormButton implements PlatformWidgetComp {
  render(widgetState) {
    const { title } = widgetState;
    return (
      <FormButtonComp
        text={title}
        onClick={() => {
          console.log('click');
        }}
      />
    );
  }
}
