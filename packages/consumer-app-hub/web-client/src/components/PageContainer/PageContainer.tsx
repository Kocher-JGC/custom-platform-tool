import React, { useEffect, useState, useMemo, useRef } from "react";
import { history } from "multiple-page-routing";
import { Skeleton, Result } from "antd";
import { queryPageData } from "../../services/page";
import { IUBDSLRenderer } from "@iub-dsl/platform/react";
import "./index.less";
// import D from '@iub-dsl/demo/pd/1';

// interface IContainerProps {}

const ResultRender = <Result status="500" title="500" subTitle="页面解析出错" extra={null} />;

const SkeletonRender = <Skeleton active />;

const getPageData = ({ pageId, mode, lessee, app }) => async () => {
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


/**
 * 页面加载容器，主要功能：
 * 1. 根据登录用户是否有权限访问该页面来判断是否显示页面
 * 2. 提供页面内的 UI 是否可以显示的授权功能
 */
export const PageContainer = ({
  children
}) => {
  const [data, setData] = useState({});
  // const [data, setData] = useState(D);
  const { pageId } = history.location;

  const isLoading = useRef(true);

  const Renderer = useMemo(() => {
    if (isLoading.current) {
      return SkeletonRender;
    }
    if (pageId) {
      return <IUBDSLRenderer dsl={data} />;
    }
    return ResultRender;
  }, [pageId, data]);

  // useEffect(() => {
  //   isLoading.current = true;
  //   getPageData(().then((d) => {
  //     isLoading.current = false;
  //     setData(d);
  //   });
  // }, [pageId]);

  return (
    <div className="__page_container">
      {Renderer}
    </div>
  );
};
