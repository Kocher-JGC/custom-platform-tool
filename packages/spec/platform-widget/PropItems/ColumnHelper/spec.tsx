import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { PropItem } from '../../core';

@PropItem({
  id: 'prop_flex_config',
  name: 'PropRowColumn',
  label: '列数量',
  whichAttr: ['columnCount'],
})
export class ColumnHelperSpec {
  render() {
    return (
      <div></div>
    );
  }
}
