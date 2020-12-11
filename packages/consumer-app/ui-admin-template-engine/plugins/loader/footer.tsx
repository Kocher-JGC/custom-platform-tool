import { loadPlugin } from '@engine/ui-admin-template/utils';
import React, { Component } from 'react';

export const FooterLoader = (props) => {
  const { children, plugin } = props;
  return (
    <div className="footer-container">
      {loadPlugin(plugin)}
      {children}
    </div>
  );
};
