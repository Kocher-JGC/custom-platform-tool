import React, {
  useEffect, useState, useMemo, useRef
} from 'react';
import { history } from 'umi';
import { Skeleton, Result } from 'antd';
import { queryPageData } from "@/services/page";
import { IUBDSLRenderer } from '@iub-dsl/platform/react';
import './index.less';
import D from '@iub-dsl/demo/pd/1';

interface IContainerProps {

}

const ResultRender = (
  <Result
    status="500"
    title="500"
    subTitle="页面解析出错"
    extra={null}
  />
);

const SkeletonRender = (
  <Skeleton active />
);

const getPageData = ({
  pageId, mode, lessee, app
}) => async () => {
  if (pageId) {
    // TODO 模式，租户，app 参数来源
    return queryPageData({
      id: pageId,
      mode,
      lessee,
      app
    });
  }
  return Promise.resolve({});
};

const Container: React.FC<IContainerProps> = (props) => {
  const [data, setData] = useState({});
  // const [data, setData] = useState(D);
  const { query } = history.location;

  const isLoading = useRef(false);

  const Renderer = useMemo(() => {
    if (isLoading.current) {
      return SkeletonRender;
    }
    if (query.pageId) {
      return <IUBDSLRenderer dsl={data}/>;
    }
    return ResultRender;
  }, [query.pageId, data]);

  useEffect(() => {
    isLoading.current = true;
    getPageData(query)().then((d) => {
      isLoading.current = false;
      setData(d);
    });
  }, [query.pageId]);

  return Renderer;
};

export default Container;
