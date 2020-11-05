import React, { useState, useCallback, useRef } from "react";
import { Row, Col } from "antd";
import AuthList from "./components/AuthList";
import { AuthShowTree } from "./components/AuthShowTree";
// import "./index.less";

const App: HY.SubApp = (props) => {
  const [authorities, setAuthorities] = useState<string[]>([]);
  const handleTreeSelect = useCallback((selectedKeys) => {
    setAuthorities(selectedKeys);
  }, [authorities]);
  const showTreeRef = useRef();
  const handleUpdateShowTree = () => {
    showTreeRef.reload();
  };
  return (
    <Row className="data-design-layout">
      <Col xs={24} sm={8} md={7} lg={7} xl={5} className="sidebar-menu-tree">
        <AuthShowTree
          ref = {showTreeRef}
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
  );
};

export default App;
