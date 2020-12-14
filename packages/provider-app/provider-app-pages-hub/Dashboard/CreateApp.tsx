import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { CreateApplication } from "@provider-app/services";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

export const CreateApp = ({ onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const onFinish = (values) => {
    console.log("Success:", values);
    if (submitting) return;
    setSubmitting(true);
    CreateApplication(values).then((res) => {
      setSubmitting(false);
      onSuccess();
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      {...layout}
      name="createApp"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ paddingTop: 24 }}
    >
      <Form.Item
        label="系统名称"
        name="appName"
        rules={[{ required: true, message: "系统名称必填" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="系统编码"
        name="appCode"
        rules={[
          {
            required: true,
            pattern: /^[a-z0-9]+$/,
            message: "系统编码必填，并且只能为小写字母、数字",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="系统访问编号"
        name="accessName"
        rules={[
          {
            required: true,
            pattern: /^[a-z0-9]+$/,
            message: "系统访问编号必填，并且只能为小写字母、数字",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="系统简称"
        name="appShortNameCn"
        rules={[{ required: true, message: "系统简称必填" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="系统英文简称"
        name="appShortNameEn"
        rules={[
          {
            required: true,
            pattern: /^[a-z]+$/,
            message: "系统英文简称必填，小写字母",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={submitting}>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};
