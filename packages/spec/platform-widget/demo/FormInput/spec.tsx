import React from 'react';
import { FormInputComp } from '.';
import { PlatformWidgetAccessSpec } from '../../interfaces';

export class FormInputSpec implements PlatformWidgetAccessSpec {
  name = 'FormInput'

  render(widgetState) {
    return (
      <FormInputComp {...widgetState} />
    );
  }
}
