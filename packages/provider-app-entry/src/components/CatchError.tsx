import React from 'react';

window.onerror = function (err) {
  console.error(`捕捉错误`, err);
};

export default class CatchError extends React.Component {
  render() {
    return (
      <div className="catch-error-container"></div>
    );
  }
}
