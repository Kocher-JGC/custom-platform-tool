import React from 'react';
import { FormLayout } from '@deer-ui/core/form-layout';
import { CreateApplication } from "@provider-app/services";

export const CreateApp = ({
  onSuccess
}) => {
  return (
    <div className="create-app">
      <FormLayout
        formBtns={[
          {
            text: '提交',
            action: ({ value }) => {
              console.log('value', value);
              // const _value = Object.assign({}, value, {
              //   appShortNameEn: value.appName,
              //   appShortNameCn: value.appName,
              // });
              CreateApplication(value).then(((res) => {
                onSuccess();
              }));
            }
          }
        ]}
        formOptions={[
          {
            ref: 'appName',
            type: 'input',
            title: '系统名称',
            required: true
          },
          {
            ref: 'appCode',
            type: 'input',
            title: '系统编码',
            required: true
          },
          {
            ref: 'accessName',
            type: 'input',
            title: '系统访问编号',
            required: true
          },

          {
            ref: 'appShortNameCn',
            type: 'input',
            title: '系统简称',
            required: true
          },
          {
            ref: 'appShortNameEn',
            type: 'input',
            title: '系统英文简称',
            required: true
          },
        ]}
      />
    </div>
  );
};
