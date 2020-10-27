import React from 'react';
import { FormLayout } from '@deer-ui/core/form-layout';
import { CreateApplication } from "@provider-app/services";

export const CreateApp = ({
  onSuccess
}) => {
  const id = 'hy';
  return (
    <div className="create-app">
      <FormLayout
        formBtns={[
          {
            text: '提交',
            action: ({ value }) => {
              console.log('value', value);
              const _value = Object.assign({}, value, {
                appShortNameEn: value.appName,
                appShortNameCn: value.appName,
              });
              CreateApplication(_value).then(((res) => {
                onSuccess();
              }));
            }
          }
        ]}
        formOptions={[
          {
            ref: 'appName',
            type: 'input',
            title: '应用名称',
            required: true
          },
          {
            ref: 'accessName',
            type: 'input',
            title: '应用访问编号',
            defaultValue: id,
            required: true
          },
          {
            ref: 'appCode',
            type: 'input',
            title: '应用编码',
            defaultValue: id,
            required: true
          },
        ]}
      />
    </div>
  );
};
