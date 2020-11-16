import React from 'react';
import { PropItem } from '@platform-widget-access/spec';

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
