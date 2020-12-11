import React from 'react';
import { PlatformWidget, PlatformWidgetComp, WidgetEntityState } from '@platform-widget-access/spec';
import { TextareaComp } from '.';

@PlatformWidget({
  name: 'Textarea',
  editableProps: {
    title: {
      type: 'string'
    },
    labelColor: {
      type: 'string'
    },
    realVal: {
      type: 'string'
    },
  },
})
export class Textarea implements PlatformWidgetComp {
  render(widgetState: WidgetEntityState) {
    return (
      <TextareaComp {...widgetState} />
    );
  }
}
