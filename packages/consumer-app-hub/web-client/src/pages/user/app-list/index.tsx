import React, { useEffect } from "react";
import store from "store";
import { PlusOutlined } from "@ant-design/icons";
import { List, Card, Button } from "antd";
import { connect, Dispatch } from "umi";
import { ConnectState } from "@/models/connect";
import { IAppModelState } from "@/models/app";
// import { queryPageData } from "@/services/page";
import { UrlConfKey } from "@/utils/env";
import styles from "./style.less";

const AppList: React.FC<{ app: IAppModelState; dispatch: Dispatch }> = (props) => {
  useEffect(() => {
    props.dispatch({
      type: "app/fetchInstallApp"
    });
  }, []);

  return (
    <div className={styles.appContainer}>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 4
        }}
        dataSource={(props?.app?.applications || []).concat({ type: "add" })}
        renderItem={(item) => (
          <List.Item>
            <Card>
              <div className={styles.appItemWrap}>
                {item.type === "add" ? (
                  <Button
                    type="link"
                    className={styles.appItemIcon}
                    href={`/app-installation?api=${store.get(UrlConfKey.saasServerUrl)}`}
                    target="_blank">
                    <PlusOutlined className={styles.appItemIcon} title="安装应用" />
                  </Button>
                ) : (
                  <div className={styles.appItem}>
                    <h3>{item.applicationCode}</h3>
                    <p>安装人员: {item.lesseeCode}</p>
                    <Button
                      type="primary"
                      onClick={() => {
                        props.dispatch({
                          type: "app/setCurrentApp",
                          payload: { currentApp: item }
                        });
                        props.history.push("/");
                      }}>
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

// export default AppList;

export default connect(({ app }: ConnectState) => ({
  app
}))(AppList);
