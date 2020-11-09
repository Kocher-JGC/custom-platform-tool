import React from 'react';
import AuthTree from './AuthTree';
import { getAuthorityItemsTree } from '../services/apiAgents';

/**
 * 权限项树
 * @param props
 */
const AuthItemTree = (props) => {
  return (
    <AuthTree
      onRef = {props.onRef}
      width = {props.width}
      height = {props.height}
      checkable = {props.checkable || false}
      selectable = {props.selectable || false}
      expandType = {props.expandType}
      onSelect = {props.onSelect}
      onRequest = {(searchValue) => {
        return getAuthorityItemsTree({ ...(props.searchParams || {}), name: searchValue });
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
      nodeBeautify = {(node) => {
        node.disabled = node.attachment?.binding || false;
        return node;
      }}
      onInitCheckedKeys = {(list, map, originalList) => {
        const checkedKeys:string[] = originalList.filter((node) => node.attachment?.binding).map((item) => item.key);
        const values = props.authItems || [];
        if (values.length === 0) return checkedKeys;
        return [...checkedKeys, ...originalList.map((item) => item.value).filter((value) => values.includes(value))];
      }}
    />
  );
};
export default React.memo(AuthItemTree);
