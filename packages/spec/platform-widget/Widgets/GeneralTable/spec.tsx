import React from 'react';
import { GeneralTableComp } from '.';
import { PlatformWidget, PlatformWidgetComp } from '../../core';

@PlatformWidget({
  name: 'NormalTable',
  editableProps: {
    columns: {
      type: 'array[{ key: string }]'
    }
  },
})
export class NormalTable implements PlatformWidgetComp {
  render(widgetState) {
    // console.log(widgetState);

    return (
      <GeneralTableComp {...widgetState} />
    );
  }
}
