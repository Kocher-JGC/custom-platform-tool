import React from 'react';
import { PlatformWidget, PlatformWidgetComp, WidgetEntityState } from '@platform-widget-access/spec';
import { GeneralTableComp } from '.';

@PlatformWidget({
  name: 'NormalTable',
  editableProps: {
    columns: {
      type: 'array[{ key: string }]'
    },
    search: {
      type: 'boolean'
    },
    optDS: {
      type: 'string'
    },
    title: {
      type: 'string'
    },
    titlePlace: {
      type: 'string'
    }
  },
})
export class NormalTable implements PlatformWidgetComp {
  render(widgetState: WidgetEntityState) {
    // console.log('NormalTable.widgetState', widgetState);

    return (
      <GeneralTableComp {...widgetState} />
    );
  }
}
