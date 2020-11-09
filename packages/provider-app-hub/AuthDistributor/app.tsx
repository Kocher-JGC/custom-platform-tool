import React, { useState, useCallback } from "react";
import { Row, Col, ConfigProvider } from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import AuthList from "./components/AuthList";
import AuthShowTree from "./components/AuthShowTree";
import { EXPAND_TYPE } from './constants';

// import "./index.less";

const App: HY.SubApp = () => {
  const [authorities, setAuthorities] = useState<string[]>([]);
  const handleTreeSelect = useCallback((selectedKeys) => {
    setAuthorities(selectedKeys);
  }, [authorities]);
  const [showAuthTreeRef, setShowAuthTreeRef] = useState<{reloadWithKeysRetain?:()=>void}>({});
  const handleUpdateShowTree = () => {
    showAuthTreeRef && showAuthTreeRef.reloadWithKeysRetain && showAuthTreeRef.reloadWithKeysRetain();
  };
  const onRef = (ref) => {
    setShowAuthTreeRef(ref);
  };
  return (
    <ConfigProvider locale={zhCN}>
      <Row className="data-design-layout">
        <Col xs={24} sm={8} md={7} lg={7} xl={5} className="sidebar-menu-tree">
          <AuthShowTree
            expandType = {EXPAND_TYPE.EXPAND_ALL}
            onRef = {onRef}
            checkable = {true}
            onSelect = {handleTreeSelect}
          />
        </Col>
        <Col xs={24} sm={16} md={17} lg={17} xl={19} className="content-pro-table">
          <AuthList
            authorities={authorities}
            handleUpdateShowTree = {handleUpdateShowTree}
          />
        </Col>
      </Row>
    </ConfigProvider>
  );
};

export default App;
