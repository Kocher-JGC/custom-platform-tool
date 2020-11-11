import React from 'react';
import { PropItemCompAccessSpec, PropItemRenderContext } from '@engine/visual-editor/data-structure';
import { OptionsSelector } from './comp';
import { PropItem } from '../../core';

@PropItem({
  id: 'prop_datasource_selector',
  name: 'PropDataSource',
  label: '选项数据源(待完善)',
  // optDS => option datasource
  whichAttr: ['optDS'],
  useMeta: ['dataSource'],
})
export class DatasourceSelectotHelper {
  constructor(meta) {
    // this.meta = meta
    console.log(meta);
  }

  getA() {
    console.log('A');
  }

  render(ctx: PropItemRenderContext) {
    // this.getA();
    return (
      <OptionsSelector
        whichAttr="optDS"
        {...ctx}
      />
    );
  }
}

// console.dir(A);

// export const DatasourceSelectotHelper: PropItemCompAccessSpec = {
//   id: 'prop_datasource_selector',
//   name: 'PropDataSource',
//   label: '选项数据源(待完善)',
//   // optDS => option datasource
//   whichAttr: ['optDS'],
//   useMeta: ['dataSource'],
//   render(ctx) {
//     return (
//       <OptionsSelector
//         whichAttr="optDS"
//         {...ctx}
//       />
//     );
//   }
// };
