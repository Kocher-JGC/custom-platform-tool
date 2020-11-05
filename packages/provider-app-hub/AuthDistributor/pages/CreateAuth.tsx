import React from 'react';
import {
  Form, Input, Button, Radio, Space
} from 'antd';
import { CloseModal, ShowModal } from "@infra/ui";
import { TERMINAL_TYPE_MENU } from '../constants';
import SelectShowAuthParent from './SelectShowAuthParent';
import SelectAuthItem from './SelectAuthItem';
import { ITerminalType } from '../interface';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface IOnSuccessParams {
  id:string;
  name:string
}

interface IAuthData {
  authorityId?: string
  parentCode?: string
  terminalType?: ITerminalType
  id?:string
  name?:string
}

interface IProps {
  onSuccess:(IAuthData) => void;
  onCancel: ()=>void;
  authData?: IAuthData
}

const CreateAuth = ({
  onSuccess, onCancel, authData
}: IProps) => {
  const [form] = Form.useForm();
  form.setFieldsValue(authData || {});
  const onFinish = () => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      onSuccess(values);
    });
  };

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
    >
      <Form.Item name="id" className="hidden"></Form.Item>
      <Form.Item
        name="name" label="权限树名称" rules={[
          { required: true, message: "权限树名称必填" },
          { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/, message: '支持30个字符内的中文、英文、数字' }
        ]}
      >
        <Input
          placeholder="请输入权限树名称"
          onChange={() => {
            console.log(form.getFieldsValue());
          }}
        />
      </Form.Item>
      <Form.Item name="authorityId" className="hidden"></Form.Item>
      <Form.Item
        name="authorityName"
        label="关联权限项"
        rules={[
          { required: true, message: "关联权限项必填" }
        ]}
      >
        <Input
          className="cursor-pointer"
          placeholder="请选择关联权限项"
          readOnly
          onClick={() => {
            const modalIDParent = ShowModal({
              title: '选择关联权限项',
              width: 300,
              children: () => {
                return (
                  <div className="p20 clearfix">
                    <SelectAuthItem
                      authItems={[form.getFieldValue('authorityId')]}
                      onSuccess = {({ id, name }) => {
                        form.setFieldsValue({
                          authorityName: name || '',
                          authorityId: id || ''
                        });
                        CloseModal(modalIDParent);
                      }}
                      onCancel = {() => {
                        CloseModal(modalIDParent);
                      }}
                    />
                  </div>
                );
              }
            });
          }}
        />
      </Form.Item>
      <Form.Item name="parentCode" className="hidden"></Form.Item>
      <Form.Item name="parentName" label="上级">
        <Input
          className="cursor-pointer"
          placeholder="请选择上级"
          readOnly
          onClick={() => {
            const modalIDParent = ShowModal({
              title: '选择上级权限树',
              width: 300,
              children: () => {
                return (
                  <div className="p20 clearfix">
                    <SelectShowAuthParent
                      showAuthItems={[form.getFieldValue('parentCode')]}
                      onSuccess = {({ id, name }) => {
                        form.setFieldsValue({
                          parentName: name || '',
                          parentCode: id || ''
                        });
                        CloseModal(modalIDParent);
                      }}
                      onCancel = {() => {
                        CloseModal(modalIDParent);
                      }}
                    />
                  </div>
                );
              }
            });
          }}
        />
      </Form.Item>
      <Form.Item name="terminalType" label="终端类型" rules={[{ required: true, message: "终端类型必填" }]}>
        <Radio.Group>
          {
            TERMINAL_TYPE_MENU.map(({ label, value }) => <Radio key={value} value={value}>{label}</Radio>)
          }
        </Radio.Group>
      </Form.Item>
      <Form.Item {...tailLayout} style={{ marginBottom: 0 }}>
        <Space className="float-right">
          <Button type="primary" onClick={onFinish}>
            确定
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            取消
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default React.memo(CreateAuth);
