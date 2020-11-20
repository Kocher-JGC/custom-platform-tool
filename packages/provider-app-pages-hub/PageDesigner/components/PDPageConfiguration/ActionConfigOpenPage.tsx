import React, { useEffect, useState } from 'react';
import {
  Form, Input, Button, Radio, Select, Space
} from 'antd';
import pick from 'lodash/pick';
import { getPageListServices } from '@provider-app/page-manager/services/apis';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface IOnSuccessParams {
  id:string;
  name:string
}

interface IProps {
  onSuccess:(item: IOnSuccessParams, name: string) => void;
  onCancel:()=>void
  config: any
}

const OPEN_TYPE_MENU = [
  { label: '覆盖当前页面', value: 'replaceCurrentPage', key: 'replaceCurrentPage' },
  { label: '弹窗页面', value: 'openModal', key: 'openModal' },
  { label: '新浏览器tab页', value: 'newTabInBrowser', key: 'newTabInBrowser' },
  { label: '应用内页面跳转', value: 'newTabInApp', key: 'newTabInApp' },
];
const PAGE_AREA_MENU = [
  { label: '配置页面', value: 'pageConfigured', key: 'pageConfigured' },
  { label: '非配置页面（未实现）', value: 'pageOutside', key: 'pageOutside' },
];
const PAGE_TYPE_MENU = [
  { label: '地址（未实现）', value: 'address', key: 'address' },
  { label: '功能码（未实现）', value: 'funcCode', key: 'funcCode' },
];
export const ActionConfigOpenPage = ({
  onSuccess, onCancel, config
}: IProps) => {
  const [form] = Form.useForm();
  const [pageList, setPageList] = useState([]);
  const onFinish = (data) => {
    const { openType, pageArea, link } = data;
    /** 打开方式 */
    const openTypeCn = OPEN_TYPE_MENU.filter(item=>item.value === openType)[0]?.label;
    /** 打开页面 */
    let pageNameCn = link;
    if(pageArea === 'pageConfigured'){
      pageNameCn = pageList.filter(item=>item.value === link)[0]?.label;
    }
    onSuccess(data, `以 ${openTypeCn} 打开 ${pageNameCn}`);
  };

  useEffect(() => {
    getPlatformPage();
    const data = pick(config || {
      openType: 'openModal',
      pageArea: 'pageConfigured'
    }, ['openType', 'pageArea', 'pageType', 'link']);
    form.setFieldsValue(data);
  }, []);

  const getPlatformPage = () => {
    getPageListServices({}).then((pageListRes) => {
      let pageListTmpl = pageListRes.result?.data || [];
      pageListTmpl = Array.isArray(pageListTmpl) ? 
        pageListTmpl.map(item=>{
          return { label: item.name, value: item.id, key: item.id };
        }) : [];
      setPageList(pageListTmpl);
    });
  };
  const onReset = () => {
    form.resetFields();
    form.setFieldsValue({
      openType: 'openModal',
      pageArea: 'pageConfigured'
    });
  };

  return (
    <Form
      {...layout}
      form={form}
      name="open-page"
      onFinish={onFinish}
      initialValues={{
        type: 1,
        belongMenus: []
      }}

    >
      <Form.Item
        name="openType" label="打开方式" rules={[{
          required: true, message: '打开方式必填'
        }]}
      >
        <Select 
          options={OPEN_TYPE_MENU}
        />
      </Form.Item>
      <Form.Item
        name="pageArea" 
        label="链接地址" 
        rules={[{ required: true, message: "链接地址必填" }]}
      >
        <Radio.Group 
          options={PAGE_AREA_MENU} 
        />
      </Form.Item>
      <Form.Item
        shouldUpdate
        noStyle
      >
        {({ getFieldValue }) => {
          const pageArea = getFieldValue('pageArea');
          return pageArea === 'pageConfigured' ? (
            <Form.Item name="link" label="链接页面">
              <Select 
                showSearch
                filterOption = {(value, option)=>{
                  return option.label.toLowerCase().includes(value.toLowerCase());
                }}
                options={pageList}
              />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="pageType" 
                label="页面类型" 
                rules={[{ required: true, message: "页面类型必填" }]}
              >
                <Radio.Group 
                  defaultValue='address'
                  options={PAGE_TYPE_MENU} 
                />
              </Form.Item>
              <Form.Item
                name="link" label="链接页面"
                rules={[{ required: true, message: "链接页面必填" }]}
              >
                <Input placeholder="请输入页面跳转链接或功能码"/>
              </Form.Item>
            </>
          );
        }}
      </Form.Item>
      <Form.Item {...tailLayout} style={{ marginBottom: 0 }}>
        <Space className="float-right">
          <Button htmlType="button" onClick={onReset}>
            清空
          </Button>
          <Button type="primary" htmlType="submit">
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
