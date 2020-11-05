import React from 'react';
import AuthTree from './AuthTree';
import { getShowAuthoritiesTree } from '../services/apiAgents';

const AuthShowTree = (props) => {
  return (
    <AuthTree
      checkedValues = {props.showAuthItems}
      checkable = {props.checkable || false}
      selectable = {props.selectable || false}
      onSelect = {props.onSelect}
      onRequest = {(searchValue) => {
        return getShowAuthoritiesTree({ ...(props.searchParams || {}), name: searchValue });
      }}
      expandType = {props.expandType}
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
export default React.memo(AuthShowTree);
