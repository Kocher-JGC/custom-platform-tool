import React from 'react';
import { PlatformWidget, PlatformWidgetComp, WidgetEntityState } from '@platform-widget-access/spec';
import { FormTimePickerComp } from '.';

@PlatformWidget({
  name: 'FormTimeTicker',
  editableProps: {
    title: {
      type: "string"
    },
    labelColor: {
      type: "string"
    },
    realVal: {
      type: "string"
    },
  }
})
export class FormTimeTicker implements PlatformWidgetComp {
  // constructor(widgetMeta) {}

  render(widgetState) {
    return (
      <FormTimePickerComp {...widgetState} />
    );
  }
}
