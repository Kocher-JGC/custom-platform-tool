import React from 'react';
import { DropdownSelectorComp } from '.';
import { PlatformWidget, PlatformWidgetComp } from '../../core';

@PlatformWidget({
  name: 'DropdownSelector',
  editableProps: {},
})
export class DropdownSelector implements PlatformWidgetComp {
  render(widgetState) {
    // console.log(widgetState);
    return (
      <DropdownSelectorComp {...widgetState} />
    );
  }
}
