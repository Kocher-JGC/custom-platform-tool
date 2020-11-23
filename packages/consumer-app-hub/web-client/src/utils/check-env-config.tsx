import React from 'react';
import { Modal, List } from 'antd';

export const checkEnvConfig = (appEnvConfig) => {
  const { pageServerUrlForApp, saasServerUrl } = appEnvConfig;
  if(!appEnvConfig["app/code"]) {
    Modal.error({
      title: '您的配置有误，有以下几种情况：',
      content: (
        <div>
          <List
            dataSource={[
              `1. 缺少必要的配置 currentApp`,
              `2. 应用的前端程序未安装，请先安装应用`,
              `3. 在启动应用前需要指定必要的配置字段 currentApp，请检查配置`,
            ]}
            renderItem={item => <List.Item>{item}</List.Item>}
            footer={'如果经过上述排查后仍然无法解决此错误，请联系 IT。'}
          />
        </div>
      )
    });
    return false;
  }
  if(!appEnvConfig["app/lessee"]) {
    Modal.error({
      title: '您的配置有误，有以下几种情况：',
      content: (
        <div>
          <List
            dataSource={[
              `1. 导出的应用配置中缺少租户信息 lessee`,
            ]}
            renderItem={item => <List.Item>{item}</List.Item>}
            footer={'如果经过上述排查后仍然无法解决此错误，请联系 IT。'}
          />
        </div>
      )
    });
    return false;
  }
  if(!pageServerUrlForApp) {
    Modal.error({
      title: '您的配置有误，有以下几种情况：',
      content: (
        <div>
          <List
            dataSource={[
              `1. 缺少必要的配置 pageServerUrlForApp`,
            ]}
            renderItem={item => <List.Item>{item}</List.Item>}
            footer={'如果经过上述排查后仍然无法解决此错误，请联系 IT。'}
          />
        </div>
      )
    });
    return false;
  }
  if(!saasServerUrl) {
    Modal.error({
      title: '您的配置有误，有以下几种情况：',
      content: (
        <div>
          <List
            dataSource={[
              `1. 缺少必要的配置 saasServerUrl`,
            ]}
            renderItem={item => <List.Item>{item}</List.Item>}
            footer={'如果经过上述排查后仍然无法解决此错误，请联系 IT。'}
          />
        </div>
      )
    });
    return false;
  }

  return true;
};

export const showFetchMainJsonError = () => {
  Modal.error({
    title: '获取主配置失败！',
    content: (
      <div>
        <List
          dataSource={[
            `1. 请先安装应用`,
          ]}
          renderItem={item => <List.Item>{item}</List.Item>}
          footer={'如果经过上述排查后仍然无法解决此错误，请联系 IT。'}
        />
      </div>
    )
  });
};
