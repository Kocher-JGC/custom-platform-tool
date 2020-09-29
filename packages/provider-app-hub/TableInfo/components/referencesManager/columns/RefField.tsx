import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';

import { canColumnEdit, openNotification, translateRefFieldsToSelectMenus } from '../service';
import RenderText from '../../RenderText';
import {
  REFERENCES_KEY, NOTIFICATION_TYPE, API_ERROR_MSG, COLUMNS_KEY
} from '../constant';

import {
  IEditableRecord, ISELECTSMENU, IReferenceShowKey, ITableColumn
} from '../../../interface';
import { getTableInfo } from '../../../api';

interface IProps {
  text: string
  record: IEditableRecord
  form: FormInstance
  code: IReferenceShowKey
  name: string
  label?:string
  handleChange?: (param: {fieldSize: number, name: string, fieldType: string})=>void
}
export const RefField: React.FC<IProps> = (props: IProps) => {
  const {
    form, text, record, code, name, handleChange, label
  } = props;
  const [options, setOptions] = useState<ISELECTSMENU[]>([]);
  const [fieldOptions, setFieldOptions] = useState<ITableColumn[]>([]);
  const editable = canColumnEdit(record, form, code);
  const getMenusData = () => {
    const id = form.getFieldValue(REFERENCES_KEY?.REFTABLEID);
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
    editable && getMenusData();
  }, [editable]);
  const handleValueChange = (value) => {
    const {
      [COLUMNS_KEY.FIELDSIZE]: fieldSize,
      [COLUMNS_KEY.FIELDTYPE]: fieldType,
      [COLUMNS_KEY.NAME]: fieldName
    } = fieldOptions.filter((item) => item.code === value)?.[0];
    handleChange && handleChange({ fieldSize, fieldType, name: fieldName });
  };
  const handleDropdown = (oepn:boolean) => {
    oepn && getMenusData();
  };
  return editable ? (
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
  ) : (
    <RenderText text={text}/>
  );
};
export default React.memo(RefField);
