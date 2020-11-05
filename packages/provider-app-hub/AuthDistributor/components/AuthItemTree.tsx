import React from 'react';
import AuthTree from './AuthTree';
import { getAuthorityItemsTree } from '../services/apiAgents';

export const AuthItemTree = (props) => {
  return (
    <AuthTree
      checkable = {props.checkable || false}
      selectable = {props.selectable || false}
      onSelect = {props.onSelect}
      onRequest = {(searchValue) => {
        return getAuthorityItemsTree({ name: searchValue });
      }}
      nodeConfig = {{
        columnImg: {
          uniqueId: 'id',
          parentUniqueId: 'pid',
          value: 'attachment.authorityId',
          name: 'name'
        },
        titleBeautifyBySearchValue: true
      }}
    />
  );
};
