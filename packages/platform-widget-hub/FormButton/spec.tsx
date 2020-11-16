import React from 'react';
import { PlatformWidget, PlatformWidgetComp, WidgetEntityState } from '@platform-widget-access/spec';
import { FormButtonComp } from '.';

@PlatformWidget({
  name: 'FormButton',
  editableProps: {
    title: {
      type: 'string'
    },
  },
})
export class FormButton implements PlatformWidgetComp {
  render(widgetState: WidgetEntityState) {
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
