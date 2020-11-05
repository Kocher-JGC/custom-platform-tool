import React from 'react';
import AuthTree from './AuthTree';
import { getAuthorityItemsTree } from '../services/apiAgents';

const AuthItemTree = (props) => {
  return (
    <AuthTree
      checkedValues = {props.authItems}
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
export default React.memo(AuthItemTree);
