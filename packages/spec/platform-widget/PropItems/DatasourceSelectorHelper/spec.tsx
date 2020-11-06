import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { OptionsSelector } from './comp';
// import { PropItem } from '../../utils';

// @PropItem({
//   id: 'prop_datasource_selector',
//   name: 'PropDataSource',
//   label: '选项数据源',
//   whichAttr: ['options'],
// })
// class A {
//   render() {
//     return (
//       <div></div>
//     );
//   }
// }

// console.dir(A);

export const DatasourceSelectotHelper: PropItemCompAccessSpec = {
  id: 'prop_datasource_selector',
  name: 'PropDataSource',
  label: '选项数据源(待完善)',
  // optDS => option datasource
  whichAttr: ['optDS'],
  useMeta: ['dataSource'],
  render(ctx) {
    return (
      <OptionsSelector
        whichAttr="optDS"
        {...ctx}
      />
    );
  }
};
