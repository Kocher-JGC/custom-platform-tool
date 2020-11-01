import React from 'react';
import { GeneralTableComp } from '.';
import { BusinessWidgetAccessSpec } from '../../interfaces';

export const NormalTable: BusinessWidgetAccessSpec = () => ({
  name: 'NormalTable',

  editableProps: {
    columns: {
      type: 'array[{ key: string }]'
    }
  },

  render(widgetState) {
    // console.log(widgetState);

    return (
      <GeneralTableComp {...widgetState} />
    );
  }
});
