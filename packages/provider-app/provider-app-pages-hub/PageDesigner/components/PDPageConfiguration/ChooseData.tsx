import React, { useEffect } from "react";
import { Form, Input, Select, InputNumber, Divider } from "antd";

export const SHOW_TYPE_OPTIONS = [
  {
    key: 1,
    value: 1,
    label: "表格",
  },
  {
    key: 2,
    value: 2,
    label: "树形",
  },
  {
    key: 3,
    value: 3,
    label: "左树右表",
  },
  {
    key: 4,
    value: 4,
    label: "自定义",
  },
];
export const SELECT_TYPE_OPTIONS = [
  {
    key: 1,
    value: 1,
    label: "单选",
  },
  {
    key: 2,
    value: 2,
    label: "多选",
  },
];
/**
 * 基础弹窗配置
 */
export const BasicForm = () => {
  return (
    <>
      <Form.Item
        className="w-1/2 float-left px-6"
        name="title"
        label="弹窗标题"
        rules={[
          { required: true, message: "弹窗标题必填" },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z]{1,32}$/,
            message: "支持32字符内的中英文",
          },
        ]}
      >
        <Input placeholder="请输入弹窗标题" />
      </Form.Item>
      <Form.Item
        className="w-1/2 float-left px-6"
        name="showType"
        label="展示类型"
        rules={[{ required: true, message: "展示类型必填" }]}
      >
        <Select placeholder="请输入展示类型" options={SHOW_TYPE_OPTIONS} />
      </Form.Item>
      <Form.Item
        className="w-1/2 float-left px-6"
        name="selectType"
        label="选择方式"
        rules={[{ required: true, message: "选择方式必填" }]}
      >
        <Select placeholder="请输入选择方式" options={SELECT_TYPE_OPTIONS} />
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.selectType !== currentValues.selectType
        }
      >
        {({ getFieldValue }) => {
          return getFieldValue("selectType") === 2 ? (
            <Form.Item
              className="w-1/2 float-left px-6"
              name="selectCount"
              label="最多选择个数"
              rules={[
                { required: true, message: "最多选择个数必填" },
                {
                  pattern: /^[1-9]\d*$/,
                  message: "支持数字",
                },
              ]}
            >
              <InputNumber placeholder="请输入最多选择个数" />
            </Form.Item>
          ) : null;
        }}
      </Form.Item>
    </>
  );
};
export const DsHelper = ({ platformCtx }) => {
  const getInterDatasources = () => {
    return [];
  };
  const getFieldOptions = (interDatasource) => {
    const result = interDatasource.map((ds) => ({
      title: ds.name,
      value: ds.id,
      children: ds.columns.map((column) => ({
        title: column.name,
        value: column.id,
      })),
    }));
    return result;
  };
  return (
    <Form.Item noStyle shouldUpdate>
      {({ getFieldValue, setFieldsValue }) => {
        return (
          <Form.Item
            className="w-1/2 float-left px-6"
            name="dsTitle"
            label="数据源"
            rules={[{ required: true, message: "数据源必填" }]}
          >
            <Input
              placeholder="请选择数据源"
              readOnly
              onClick={() => {
                const closeModal = platformCtx.selector.openDatasourceSelector({
                  defaultSelected: getInterDatasources(),
                  modalType: "normal",
                  typeArea: ["TABLE"],
                  position: "top",
                  single: true,
                  onSubmit: ({ interDatasources }) => {
                    const oldDs = getFieldValue("ds");
                    const { id: ds, columns, name: dsTitle } =
                      interDatasources[0] || {};
                    setFieldsValue({
                      dsInfo: interDatasources,
                      dsTitle,
                      ds,
                      fieldOptions: getFieldOptions(interDatasources),
                    });
                    if (oldDs !== ds) {
                      setFieldsValue({
                        returnValue: [],
                        returnText: [],
                        showColumn: [],
                        sortColumnInfo: null,
                      });
                    }
                    // onAddDataSource(interDatasources);
                    closeModal();
                  },
                });
              }}
            />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};
export const FieldHelper = ({ name, label, mode }) => {
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) =>
        prevValues.ds !== currentValues.ds
      }
    >
      {({ getFieldValue }) => {
        return (
          <Form.Item
            className="w-1/2 float-left px-6"
            name={name}
            label={label}
            rules={[{ required: true, message: `${label}必填` }]}
          >
            <Select
              mode={mode || undefined}
              options={getFieldValue("fieldOptions")}
            />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};
export const SortField = (props) => {
  return (
    <Form.Item className="w-1/2 float-left px-6" name="title" label="排序字段">
      <Input placeholder="暂不支持" />
    </Form.Item>
  );
};
export const ReturnText = (props) => {
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) =>
        prevValues.ds !== currentValues.ds
      }
    >
      {({ getFieldValue, setFieldsValue }) => {
        return (
          <Form.Item
            className="w-1/2 float-left px-6"
            name="returnText"
            label="返回文本"
            rules={[{ required: true, message: `返回文本必填` }]}
          >
            <Select
              mode="multiple"
              options={getFieldValue("fieldOptions")}
              onChange={(valueList) => {
                // 标记字段默认是返回文本的第一个元素
                if (
                  !getFieldValue("tagField") &&
                  Array.isArray(valueList) &&
                  valueList[0]
                ) {
                  setFieldsValue({ tagField: valueList[0] });
                }
              }}
            />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};
export const TableForm = (props) => {
  return (
    <>
      <DsHelper {...props} />
      <SortField />
      <FieldHelper name="returnValue" label="返回值" mode="multiple" />
      <ReturnText />
      <FieldHelper name="tagField" label="标记字段" mode="" />
    </>
  );
};
export const ChooseData = ({
  platformCtx,
  config: data,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(
      data || {
        showType: 1,
        selectType: 1,
        selectCount: 10,
        fieldOptions: [],
      }
    );
  }, []);
  return (
    <Form form={form} id="chooseData">
      <BasicForm />
      <Divider />
      <TableForm platformCtx={platformCtx} />
    </Form>
  );
};
