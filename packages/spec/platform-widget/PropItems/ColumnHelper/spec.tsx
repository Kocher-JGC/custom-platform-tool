import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

export const ColumnHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_flex_config',
  name: 'PropRowColumn',
  label: '列数量',
  whichAttr: ['columnCount'],
  render() {
    return (
      <div></div>
    );
  }
};
