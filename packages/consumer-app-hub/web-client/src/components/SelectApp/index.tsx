import React, { useEffect, useState } from "react";
import store from "store";
import { PlusOutlined } from "@ant-design/icons";
import { List, Card, Button } from "antd";
import { UrlConfKey } from "../../utils/env";
import {
  queryInstallApp
} from "../../services";
import "./style.css";

interface IProps {
  selectAppInfo: (app: { code: string, lessee: string }) => void;
}

const SelectApp: React.FC<IProps> = (props) => {
  const [appList, setAppList] = useState<any[]>([]);
  useEffect(() => {
    queryInstallApp().then((res)=>{
      setAppList(Object.values(res?.data || {}));
    });
  }, []);

  return (
    <div className="selectAppContainer">
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 4
        }}
        dataSource={(appList).concat({ type: "add" })}
        renderItem={(item) => (
          <List.Item>
            <Card>
              <div className="selectAppItemWrap">
                {item.type === "add" ? (
                  <Button
                    type="link"
                    className="selectAppItemHandle"
                    href={`${process?.env?.NODE_ENV === "development" ? "http://localhost:5020" : ""}/app-installation?api=${store.get(UrlConfKey.saasServerUrl)}`}
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
          </List.Item>
        )}
      />
    </div>
  );
};

export default SelectApp;
