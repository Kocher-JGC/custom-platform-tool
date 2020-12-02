import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Card, Button, Row, Col, message } from "antd";
import { queryInstallApp } from "../../services";
import "./style.css";

interface IProps {
  selectAppInfo: (app: { code: string, lessee: string }) => void;
}

const SelectApp: React.FC<IProps> = (props) => {
  const [appList, setAppList] = useState<any[]>([]);
  useEffect(() => {
    queryInstallApp().then((res)=>{
      if(res?.data?.code){
        message.info(res?.data?.err || "获取已安装应用失败");
      } else {
        setAppList(Object.values(res?.data || {}));
      }
    }).catch((err)=>{
      message.error(err.message || "获取已安装应用失败");
    });
  }, []);

  return (
    <div className="selectAppContainer">
      <Row gutter={16}>
        {
          (appList).concat({ type: "add" }).map((item)=><Col key={item.applicationCode || item.type} className="gutter-row" span={6}>
            <Card>
              <div className="selectAppItemWrap">
                {item.type === "add" ? (
                  <Button
                    type="link"
                    className="selectAppItemHandle"
                    href={`${process?.env?.NODE_ENV === "development" ? "http://localhost:5020" : ""}/app-installation`}
                    target="_blank"
                  >
                    <PlusOutlined className="selectAppItemIcon" title="安装应用" />
                  </Button>
                ) : (
                  <div className="selectAppItem">
                    <h3>{item.applicationCode}</h3>
                    <p>安装人员: {item.lesseeCode}</p>
                    <Button
                      type="primary"
                      onClick={() => {
                        props?.selectAppInfo({ code: item.applicationCode, lessee: item.lesseeCode });
                      }}
                    >
                      进入应用
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </Col>)
        }
      </Row>
    </div>
  );
};

export default SelectApp;
