import React from 'react';
import { PlatformWidget, PlatformWidgetComp, WidgetEntityState } from '@platform-widget-access/spec';
import { FormInputNumberComp } from '.';

@PlatformWidget({
  name: 'FormInputNumber',
  editableProps: {
    title: {
      type: "string"
    },
    max: {
      type: "number"
    },
    min: {
      type: "number"
    },
    noteInfo: {
      type: "string"
    },
    promptInfo: {
      type: "string"
    },
    radixPoint: {
      type: "string"
    },
    labelColor: {
      type: "string"
    },
    realVal: {
      type: "number"
    },
  }
})
export class FormInputNumber implements PlatformWidgetComp {
  // constructor(widgetMeta) {}
  render(widgetState) {
    console.log(widgetState);
    return (
      <FormInputNumberComp {...widgetState} />
    );
  }
}
