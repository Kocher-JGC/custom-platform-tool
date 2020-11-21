import React from 'react';
import AuthTree from './AuthTree';
import { getShowAuthoritiesTree } from '../services/apiAgents';

/**
 * 权限展示树
 * @param props
 */
const AuthShowTree = (props) => {
  return (
    <AuthTree
      width = {props.width}
      height = {props.height}
      onInitCheckedKeys = {(list, map, originalList) => {
        const values = props.showAuthItems || [];
        if (values.length === 0) return [];
        return originalList.map((item) => item.value).filter((value) => values.includes(value));
      }}
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
      onDeleteNode = {props.onDeleteNode}
      canIDeleteNode = {props.canIDeleteNode}
    />
  );
};
export default React.memo(AuthShowTree);
