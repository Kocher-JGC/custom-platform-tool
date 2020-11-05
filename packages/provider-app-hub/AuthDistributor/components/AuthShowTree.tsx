import React from 'react';
import AuthTree from './AuthTree';
import { getShowAuthoritiesTree } from '../services/apiAgents';

export const AuthShowTree = (props) => {
  return (
    <AuthTree
      checkable = {props.checkable || false}
      selectable = {props.selectable || false}
      onSelect = {props.onSelect}
      onRequest = {(searchValue) => {
        return getShowAuthoritiesTree({ name: searchValue });
      }}
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
