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
  render(widgetState: WidgetEntityState, eventHandle = {}) {
    const { title } = widgetState;
    const { onClick } = eventHandle;
    return (
      <FormButtonComp
        text={title}
        onClick={() => {
          onClick?.();
          console.log('click');
        }}
      />
    );
  }
}
