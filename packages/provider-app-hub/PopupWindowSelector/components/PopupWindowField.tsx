import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';

import {
  openNotification, getTableInfo
} from '../service';
import {
  NOTIFICATION_TYPE, API_ERROR_MSG, COLUMNS_KEY, FIELDTYPE
} from '../constant';

import {
  ISELECTSMENU, IPopupWindowShowKey, ITableColumn, ITableColumnFromApi
} from '../interface';

interface IProps {
  text: string
  form: FormInstance
  code: IPopupWindowShowKey
  name: string
  label?:string
  handleChange?: (param: {fieldSize: number, name: string, fieldType: string})=>void
}

/**
 * 更改字段列表为 下拉框组件支持的数据格式
 * @param fields 字段列表
 * @returns selectMenu 下拉框列表
 */
export const translateRefFieldsToSelectMenus = (fields: ITableColumnFromApi[]):ISELECTSMENU[] => {
  if (!Array.isArray(fields)) return [];
  return fields
    .filter((item) => item.fieldType !== FIELDTYPE.TEXT)
    .map((item) => {
      return {
        // key: item?.code,
        // value: item?.code,
        // label: item?.name
        key: item?.id,
        value: item?.id,
        label: item?.name
      };
    });
};

export const PopupWindowField: React.FC<IProps> = (props: IProps) => {
  const {
    form, text, code, name, handleChange, label
  } = props;
  const [options, setOptions] = useState<ISELECTSMENU[]>([]);
  const [fieldOptions, setFieldOptions] = useState<ITableColumn[]>([]);

  const getTableIdByTableCode = (datasource) => {
    if (!code && !Array.isArray(options)) return '';
    return options.filter((item) => item.value === datasource)?.[0]?.key || '';
  };

  const getMenusData = () => {
    const id = form.getFieldValue('datasourceKey');
    if (!id) {
      setOptions([]);
      return;
    }
    getTableInfo(id).then((res) => {
    /** 如果接口没有提供提示信息 */
      if (!res?.msg) {
        openNotification(NOTIFICATION_TYPE?.ERROR, API_ERROR_MSG?.ALLOWDELETE);
        return;
      }
      setFieldOptions(res?.result?.columns);
      const fieldSelectOptions = translateRefFieldsToSelectMenus(res?.result?.columns);
      setOptions(fieldSelectOptions);
    });
  };
  useEffect(() => {
    getMenusData();
  }, []);
  const handleValueChange = (value) => {
    /*
    const {
      [COLUMNS_KEY.FIELDSIZE]: fieldSize,
      [COLUMNS_KEY.FIELDTYPE]: fieldType,
      [COLUMNS_KEY.NAME]: fieldName
    } = fieldOptions.filter((item) => item.code === value)?.[0];
    handleChange && handleChange({ fieldSize, fieldType, name: fieldName });
    */
    console.log(value);
  };
  const handleDropdown = (oepn:boolean) => {
    oepn && getMenusData();
  };
  return (
    <Form.Item
      name={code}
      label = {label}
      rules={[
        { required: true, message: `${name}必填` },
      ]}
    >
      <Select
        onChange={(value) => { handleValueChange(value); }}
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        onDropdownVisibleChange={handleDropdown}
        options = {options}
      />
    </Form.Item>
  );
};
export default React.memo(PopupWindowField);
