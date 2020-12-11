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
    titleAlign: {
      type: 'string'
    },
    defaultPageSize: {
      type: 'number'
    },
    showOrderColumn: {
      type: 'boolean'
    },
    queryType: {
      type: '{[key: string]: {queryStyle: string, maxNum?:number}|null}'
    }
  },
})
export class NormalTable implements PlatformWidgetComp {
  render(widgetState: WidgetEntityState, eventsHandler) {
    // console.log('NormalTable.widgetState', widgetState);

    return (
      <GeneralTableComp {...widgetState} eventsHandler={eventsHandler} />
    );
  }
}
