/**
 * 此入口仅用于启动独立应用，需要应用该应用，请通过 ./src/app.tsx
 */
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './app.tsx';

ReactDOM.render(<App />, document.querySelector('#Main'));
