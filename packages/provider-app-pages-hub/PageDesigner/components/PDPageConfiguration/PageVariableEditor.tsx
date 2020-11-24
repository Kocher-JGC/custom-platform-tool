import React, { useEffect } from 'react';
import { Button, Form, Input, Select, Space, InputNumber, DatePicker, TimePicker } from 'antd';
import moment from 'moment';

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const VAR_ATTR_TYPE_MENU = [
  { label: '字符串', value: 'string', key: 'string' },
  { label: '数字', value: 'number', key: 'number' },
  { label: '日期', value: 'date', key: 'date' },
  { label: '日期时间', value: 'dateTime', key: 'dateTime' }
];
export const VariableEditor = ({
  data, mode, onCancel, onSuccess
})=>{
  const [form] = Form.useForm();
  useEffect(()=>{
    form.setFieldsValue({ varType: 'string' });
    if(mode === 'UPDATE'){
      form.setFieldsValue(data);
    }    
  }, []);
  const onFinish = (fieldsValue) => {
    for(const key in fieldsValue){
      fieldsValue[key] = fieldsValue[key] || null;
    }
    onSuccess(fieldsValue);
  };
  const onReset = () => {
    form.resetFields();
    if(mode === 'UPDATE'){
      form.setFieldsValue({
        varType: data.varType,
        code: data.code
      });
    }
  };
  const getMonentValue = (value)=>{
    return value ? moment(value) : null;
  };
  const valRenderer = ({ setFieldsValue, getFieldsValue }) => {
    const { varType, realVal } = getFieldsValue(['realVal', 'varType']);
    /** 字符串 */
    if(varType === 'string') return <Input />;
    /** 数字 */
    if(varType === 'number') return <InputNumber/>;
    /** 日期 */
    if(varType === 'date') return <DatePicker />;
    /** 日期时间 */
    if(varType === 'dateTime') return (
      <>
        <DatePicker 
          value={getMonentValue((realVal || '').split(' ')[0])}
          onChange={(_m, dateString)=>{
            const [_d, time] = (realVal || '').split(' ');
            setFieldsValue({ realVal: `${dateString || ''} ${time || ''}` });
          }} 
        />
        <TimePicker 
          value={getMonentValue((realVal || '').split(' ')[1])}
          onChange={(_m, timeString)=>{
            const [date, _t] = (realVal || '').split(' ');
            setFieldsValue({ realVal: `${date || ''} ${timeString || ''}` });
          }}
        />
      </>
    );
  };
  return (
    <Form
      {...layout}
      form={form}
      className="edit-variable"
      onFinish={onFinish}
    >
      <Form.Item
        name="code" label="变量编码"
        rules={[
          { required: true, message: '请填写变量编码' },
          { pattern: /^[a-zA-Z0-9\._]+$/, message: '只能填写字母、数字、下划线和 .' }
        ]}
      >
        <Input 
          disabled = {mode!=="INSERT"}
        />
      </Form.Item>
      <Form.Item
        name="varType" label="类型"
        rules={[{ required: true, message: '请填写类型' }]}
      >
        <Select 
          onChange = {()=>{
            form.setFieldsValue({ realVal: null });
          }}
          options={VAR_ATTR_TYPE_MENU}
        />
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate
      >
        {({ getFieldsValue, setFieldsValue })=>{
          return (
            <Form.Item
              name="realVal" label="变量值"
            >
              {valRenderer({ setFieldsValue, getFieldsValue })}
            </Form.Item>
          );
        }}
      </Form.Item>
      
      <Form.Item
        name="alias" label="描述"
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }} {...tailLayout}>
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