import React from 'react';
import { ValueHelper } from './comp';
import { PropItem } from '../../core';

@PropItem({
  id: 'prop_real_value',
  name: 'PropValue',
  label: '值',
  whichAttr: ['realVal', 'exp', 'variable'],
})
export class ValueHelperSpec {
  render(ctx) {
    const { changeEntityState, editingWidgetState } = ctx;

    return (
      <ValueHelper
        onChange={changeEntityState}
        editingWidgetState={editingWidgetState}
      />
    );
  }
}
