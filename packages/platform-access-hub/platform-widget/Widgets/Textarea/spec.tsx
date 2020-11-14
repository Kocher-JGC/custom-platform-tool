import React from 'react';
import { TextareaComp } from '.';
import { PlatformWidget, PlatformWidgetComp } from '../../core';

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
  render(widgetState) {
    return (
      <TextareaComp {...widgetState} />
    );
  }
}
