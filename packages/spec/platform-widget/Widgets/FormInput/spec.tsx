import React from 'react';
import { WidgetEntityState } from '@engine/visual-editor/data-structure';
import { FormInputComp } from '.';
import { BusinessWidgetAccessSpec, BusinessWidgetMeta } from '../../interfaces';

export class FormInput extends BusinessWidgetAccessSpec {
  name = 'FormInput'

  constructor() {
    super();

    this.editableProps = {
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
    };
  }

  render = (widgetState: WidgetEntityState) => {
    return (
      <FormInputComp {...widgetState} />
    );
  }
}
