/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Button, Form, Input, Select, InputNumber, message, notification
} from 'antd';
import { TABLE_OPTIONS, TABLE_TYPE, SPECIES } from '../constant';
import {
  NameCodeItem, ModuleTreeItem, PrimaryTreeItem, FromFooterBtn
} from "./FormItem";
import CreateMenu from './CreateMenu';
import { queryLesseeAuthorityListService, createLesseeAuthorityService } from '../service';
import { ILesseeAuthority, ISELECTSMENU } from '../interface';

import './index.less';
import CreateModal from './CreateModal';

const { Option } = Select;
const { TextArea } = Input;

interface IProps {
  onOk: () => void;
  onCancel: () => void;

  upDataMenus: () => void;
}
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

export const translateParentCodeToSelectMenus = (record: ILesseeAuthority[]):ISELECTSMENU[] => {
  if (!Array.isArray(record)) return [];
  return record
    // .filter((item) => item.fieldType !== FIELDTYPE.TEXT)
    .map((item) => {
      return {
        key: item?.code,
        value: item?.code,
        label: item?.name
      };
    });
};

const CreateLesseeAuthority: React.FC<IProps> = (props: IProps) => {
  const { onCancel, onOk, upDataMenus } = props;
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [parentCodeOptions, setParentCodeOptions] = useState<ISELECTSMENU[]>([]);
  const [showTypeWithoutAuthority, setShowTypeWithoutAuthority] = useState<string>('FORBIDDEN');

  const handleFinish = async (values) => {
    const params = assemblyParams(values);
    Object.assign(params, { createType: 'CUSTOM' });
    const res = await createLesseeAuthorityService(params);
    if (res.code === "00000") {
      notification.success({
        message: "新增成功",
        duration: 2
      });
      onOk && onOk();
    } else {
      message.error(res.msg);
    }
  };
  /**
   * 创建表接口参数拼装
   * @param values
   */
  const assemblyParams = (values) => {
    const {
      name, code, type, parentCode
    } = values;
    const params = {
      name,
      code,
      type,
      showTypeWithoutAuthority,
      parentCode
    };
    return params;
  };

  const createModule = () => {
    setVisibleModal(true);
  };

  const handleMenuOk = () => {
    setVisibleModal(false);
    upDataMenus && upDataMenus();
  };
  const handleFormCancel = () => {
    onCancel && onCancel();
  };
  useEffect(() => {
    queryLesseeAuthorityListService({}).then((res) => {
      /** 如果接口没有提供提示信息 */
      setParentCodeOptions(translateParentCodeToSelectMenus(res?.result?.data));
    });
  }, []);

  return (
    <>
      <Form {...layout} form={form} name="control-hooks" onFinish={handleFinish}>
        <NameCodeItem form={form} />
        <Form.Item
          name="parentCode"
          label="父级编码"
          rules={[{
            required: true,
            message: "请选择父级编码"
          }]}
          initialValue={TABLE_TYPE.TABLE}
        >
          <Select
            placeholder="请选择父级编码"
            options={parentCodeOptions}
          >
            {/* {
              TABLE_OPTIONS.map((item, index) => <Option
                key={index} value={item.value}
              >{item.title}</Option>)
            } */}
          </Select>
        </Form.Item>
        <Form.Item
          name="showTypeWithoutAuthority"
          label="showTypeWithoutAuthority"
          rules={[{
            required: true,
            message: "请选择showTypeWithoutAuthority"
          }]}
        >
          <Select
            placeholder="请选择父级编码"
            options={[{ key: 'FORBIDDEN', value: 'FORBIDDEN', label: 'FORBIDDEN' }, { key: 'HIDDEN', value: 'HIDDEN', label: 'HIDDEN' }]}
          >
          </Select>
        </Form.Item>

        {/* <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
        >
          {({ getFieldValue }) => {
            return getFieldValue('type') === TABLE_TYPE.TREE
              ? (
                <Form.Item
                  name="maxLevel"
                  label="最大层级数"
                  rules={[{
                    required: true,
                    message: "请填写最大层级数"
                  }]}
                  initialValue={15}
                >
                  <InputNumber placeholder="须为正整数,最大层级不超过15级" min={2} max={15} />
                </Form.Item>
              ) : getFieldValue('type') === TABLE_TYPE.AUX_TABLE ? (
                <PrimaryTreeItem />
              ) : null;
          }}
        </Form.Item>
        <ModuleTreeItem /> */}
        {/* <Button
          type="link"
          className="create-link"
          onClick={createModule}
        >新建模块</Button>
        <Form.Item name="description" label="备注" >
          <TextArea rows={4} maxLength={100} />
        </Form.Item> */}
        <FromFooterBtn
          onCancel={handleFormCancel}
        />
      </Form>
      <CreateModal
        title="新建权限项"
        modalVisible={visibleModal}
        onCancel={() => setVisibleModal(false)}
      >
        <CreateMenu
          onCancel={() => setVisibleModal(false)}
          onOk={handleMenuOk}
        />
      </CreateModal>
    </>
  );
};

export default React.memo(CreateLesseeAuthority);
