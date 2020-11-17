import React from 'react';
import { PlatformWidget, PlatformWidgetComp, WidgetEntityState } from '@platform-widget-access/spec';
import { FormInputComp } from '.';

@PlatformWidget({
  name: 'FormInput',
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
export class FormInput implements PlatformWidgetComp {
  constructor(widgetMeta) {
    // console.log(widgetMeta);
  }

  private printA() {
    console.log('A');
  }

  render(widgetState: WidgetEntityState) {
    console.log(widgetState);
    return (
      <FormInputComp {...widgetState} />
    );
  }
}
