import React from 'react';
import { PlatformWidget, PlatformWidgetComp, WidgetEntityState } from '@platform-widget-access/spec';
import { FlexLayoutComp } from './comp';

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
export class FlexLayout implements PlatformWidgetComp {
  render(widgetState: WidgetEntityState) {
    return (
      <FlexLayoutComp {...widgetState} />
    );
  }
}
