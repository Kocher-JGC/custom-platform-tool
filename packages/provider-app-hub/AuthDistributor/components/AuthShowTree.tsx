import React from 'react';
import AuthTree from './AuthTree';
import { getShowAuthoritiesTree } from '../services/apiAgents';

export const AuthShowTree = (props) => {
  return (
    <AuthTree
      checkedValues = {props.showAuthItems}
      checkable = {props.checkable || false}
      selectable = {props.selectable || false}
      onSelect = {props.onSelect}
      onRequest = {(searchValue) => {
        return getShowAuthoritiesTree({ name: searchValue });
      }}
      expandAll = {props.expandAll}
      onRef = {props.onRef}
      nodeConfig = {{
        columnImg: {
          uniqueId: 'id',
          parentUniqueId: 'pid',
          value: 'id',
          name: 'name'
        },
        titleBeautifyBySearchValue: true
      }}
    />
  );
};
