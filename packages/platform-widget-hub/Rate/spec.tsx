import { PlatformWidget, PlatformWidgetComp, WidgetEntityState } from '@platform-widget-access/spec';
import React from 'react';
import { RateComp } from '.';

@PlatformWidget({
  name: 'Rate',
  editableProps: {
    title: {
      type: "string"
    },
    labelColor: {
      type: "string"
    },
    numberVal: {
      type: "number"
    },
  }
})
export class Rate implements PlatformWidgetComp {
  constructor(widgetMeta) {
    // console.log(widgetMeta);
  }

  private printA() {
    console.log('A');
  }

  render(widgetState: WidgetEntityState) {
    return (
      <RateComp {...widgetState} />
    );
  }
}
