import React from 'react';
import { PlatformWidget, PlatformWidgetComp, WidgetEntityState } from '@platform-widget-access/spec';
import { DropdownSelectorComp } from '.';

@PlatformWidget({
  name: 'DropdownSelector',
  editableProps: {},
})
export class DropdownSelector implements PlatformWidgetComp {
  render(widgetState: WidgetEntityState) {
    // console.log(widgetState);
    return (
      <DropdownSelectorComp {...widgetState} />
    );
  }
}
