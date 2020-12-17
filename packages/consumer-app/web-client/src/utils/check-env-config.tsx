import React from "react";
import { Modal, List } from "antd";
import * as yup from "yup";

const envConfigSchema = yup.object().shape({
  pageServerUrlForApp: yup.string().required("必须传入 pageServerUrlForApp"),
  saasServerUrl: yup.string().required("必须传入 saasServerUrl"),
});

export const checkEnvConfig = (appEnvConfig) => {
  return new Promise((resolve, reject) => {
    envConfigSchema
      .validate(appEnvConfig)
      .then((resText) => {
        // console.log(resText);
        resolve(true);
      })
      .catch((res) => {
        // console.log(res.message);
        Modal.error({
          title: "您的配置有误，有以下几种情况：",
          content: (
            <div>
              <List
                dataSource={[res.message]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
                footer={"如果经过上述排查后仍然无法解决此错误，请联系 IT。"}
              />
            </div>
          ),
        });
        resolve(false);
      });
  });
};

export const showFetchMainJsonError = () => {
  Modal.error({
    title: "获取主配置失败！",
    content: (
      <div>
        <List
          dataSource={[`1. 请先安装应用`]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
          footer={"如果经过上述排查后仍然无法解决此错误，请联系 IT。"}
        />
      </div>
    ),
  });
};
