import React, { useState } from "react";
import { Form, Input } from "formik-antd";
import { Button, Form as AntdForm } from "antd";
import { CreateApplication } from "@provider-app/services";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ErrorTip } from "@infra/ui/basic";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

const CreateFormSchema = Yup.object().shape({
  appName: Yup.string().required("必填"),
  appCode: Yup.string()
    .required("必填")
    .matches(/^[a-z0-9]+$/, "只能为小写字母、数字"),
  accessName: Yup.string()
    .required("必填")
    .max(9, "最多只能输入 9 位字符")
    .matches(/^[a-z0-9]+$/, "只能为小写字母、数字"),
  appShortNameCn: Yup.string().required("必填"),
  appShortNameEn: Yup.string()
    .required("必填")
    .matches(/^[a-z]+$/, "系统英文简称为小写字母"),
});

const FormItemTemplate = ({
  errors,
  touched,
  name,
  label,
  required = false,
  ...other
}) => {
  const error = errors[name] && touched[name];
  return (
    <AntdForm.Item
      {...other}
      label={label}
      validateStatus={error ? "error" : ""}
      required={required}
    >
      <Input name={name} placeholder={label} />
      <ErrorMessage name={name} component={ErrorTip} />
    </AntdForm.Item>
  );
};

export const CreateApp = ({ onSuccess }) => {
  return (
    <Formik
      initialValues={{
        appName: "",
        appCode: "",
        accessName: "",
        appShortNameCn: "",
        appShortNameEn: "",
      }}
      onSubmit={(values, { setSubmitting }) => {
        CreateApplication(values)
          .then(() => {
            onSuccess?.();
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
      validationSchema={CreateFormSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => {
        const hasError = Object.keys(errors).length > 0;
        return (
          <Form
            {...layout}
            name="createApp"
            className="ant-form ant-form-horizontal ant-form-default"
            style={{ padding: `30px 0` }}
          >
            <FormItemTemplate
              name="appName"
              label="系统名称"
              errors={errors}
              touched={touched}
              // required 是给 UI 显示必填的
              required
            />
            <FormItemTemplate
              name="appCode"
              label="系统编码"
              errors={errors}
              touched={touched}
              required
            />
            <FormItemTemplate
              name="accessName"
              label="系统访问编号"
              errors={errors}
              touched={touched}
              required
            />
            <FormItemTemplate
              name="appShortNameCn"
              label="系统简称"
              errors={errors}
              touched={touched}
              required
            />
            <FormItemTemplate
              name="appShortNameEn"
              label="系统英文简称"
              errors={errors}
              touched={touched}
              required
            />

            <AntdForm.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={hasError}
              >
                创建
              </Button>
            </AntdForm.Item>
          </Form>
        );
      }}
    </Formik>
  );
};
