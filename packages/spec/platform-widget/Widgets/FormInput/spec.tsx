import React from 'react';
import { WidgetEntityState } from '@engine/visual-editor/data-structure';
import { FormInputComp } from '.';
import { PlatformWidget, PlatformWidgetComp } from '../../core';

@PlatformWidget({
  name: 'FormInput',
  editableProps: {
    ad: {
      type: 'struct'
    },
    title: {
      type: "string"
    },
    labelColor: {
      type: "string"
    },
    realVal: {
      type: "string"
    },
  }
})
export class FormInput implements PlatformWidgetComp {
  constructor(widgetMeta) {
    console.log(widgetMeta);
  }

  printA() {
    console.log('A');
  }

  render(widgetState: WidgetEntityState) {
    return (
      <FormInputComp {...widgetState} />
    );
  }
}
