import React from 'react';
import { NormalTableComp } from '.';
import { TableEditor } from '../../CustomEditor/TableEditor';
import { BusinessWidgetAccessSpec } from '../../interfaces';

export const NormalTable: BusinessWidgetAccessSpec = () => ({
  name: 'NormalTable',

  editableProps: {
    columns: 'array[{ key: string }]'
  },

  propEditor(ctx) {
    return (
      <TableEditor {...ctx} />
    );
  },

  render(widgetState) {
    // console.log(widgetState);

    return (
      <NormalTableComp {...widgetState} />
    );
  }
});
