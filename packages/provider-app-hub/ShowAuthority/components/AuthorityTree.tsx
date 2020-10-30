import React, {
  forwardRef
} from 'react';
import { Tree, Input } from 'antd';
import useAuthorityList from '../useAuthorityList';

interface IProps {
  onSelect?: (selectedKeys: React.ReactText[]) => void;
}

const AuthorityTree = forwardRef((props: IProps, ref: React.Ref<{reload: () => void}>) => {
  const { onSelect } = props;
  const [authorityData, getAuthorityData] = useAuthorityList();
  return (
    <div>
      <Input.Search
        className="mb-4"
        onSearch={(value) => {
          getAuthorityData(value);
        }}
      />
      <Tree
        treeData={authorityData}
        onSelect={(selectedKeys, {
          selected
        }) => {
          onSelect && onSelect(selectedKeys);
        }}
      />
    </div>
  );
});
export default React.memo(AuthorityTree);
