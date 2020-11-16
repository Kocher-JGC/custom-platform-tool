import React from 'react';
import { PlatformWidget, PlatformWidgetComp, WidgetEntityState } from '@platform-widget-access/spec';
import { GeneralTableComp } from '.';

@PlatformWidget({
  name: 'NormalTable',
  editableProps: {
    columns: {
      type: 'array[{ key: string }]'
    }
  },
})
export class NormalTable implements PlatformWidgetComp {
  render(widgetState: WidgetEntityState) {
    // console.log(widgetState);

    return (
      <GeneralTableComp {...widgetState} />
    );
  }
}
