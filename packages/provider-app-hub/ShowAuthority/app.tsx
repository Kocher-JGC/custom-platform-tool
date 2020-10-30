import React, { useState, useCallback } from "react";
import { Row, Col } from "antd";
import AuthorityList from "./components/AuthorityList";
import AuthorityTree from "./components/AuthorityTree";
// import "./index.less";

const App: HY.SubApp = (props) => {
  const [authorities, setAuthorities] = useState<string[]>([]);
  const handleTreeSelect = useCallback((ids) => {
    setAuthorities(ids);
  }, [authorities]);

  return (
    <Row className="data-design-layout">
      <Col xs={24} sm={8} md={7} lg={7} xl={5} className="sidebar-menu-tree">
        <AuthorityTree
          onSelect={handleTreeSelect}
        />
      </Col>
      <Col xs={24} sm={16} md={17} lg={17} xl={19} className="content-pro-table">
        <AuthorityList
          authorities={authorities}
        />
      </Col>
    </Row>
  );
};

export default App;
