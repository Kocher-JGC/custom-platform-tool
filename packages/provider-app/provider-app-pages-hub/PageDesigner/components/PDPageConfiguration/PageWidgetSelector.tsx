import React, { useRef, useContext, useEffect, useState } from "react";
import { Checkbox, Form, Input, Table, Alert } from "antd";
import { ColumnType } from "antd/lib/table";
import { ThunderboltOutlined } from "@ant-design/icons";
// import { PageConfigContainerProps } from "./PageConfigContainer";
interface IFlatLayoutItem {
  id: string;
  widgetRef: string;
  wGroupType: string;
  propState: {
    title: string;
    widgetCode: string;
  };
}
interface IProps {
  flatLayoutItems: {
    [key: string]: IFlatLayoutItem;
  };
}
interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: Item;
  handleSave: (record: Item) => void;
}
interface ITableItem {
  key: string;
  id: string;
  title: string;
  widgetCode: string;
  widgetRef: string;
  _show: boolean;
  _group: string;
  _write: boolean;
  _read: boolean;
}
interface EditableRowProps {
  index: number;
}

const EditableContext = React.createContext<any>(null);

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      // inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
export const PageWidgetSelector: React.FC<IProps> = (props) => {
  console.log("props", props);
  const [dataSource, setDataSource] = useState<ITableItem[]>([]);
  const columns: ColumnType<ITableItem>[] = [
    {
      title: "控件标题",
      dataIndex: "title",
      width: 214,
      onCell: (record) => ({
        record,
        handleSave,
        editable: true,
        dataIndex: "title",
        title: "控件标题",
      }),
    },
    {
      title: "控件编码",
      dataIndex: "widgetCode",
    },
    {
      title: "显示",
      dataIndex: "_show",
      align: "center",
      render: (text) => <Checkbox checked={!!text} disabled />,
    },
    {
      title: "类型",
      dataIndex: "widgetRef",
    },
    {
      title: "所属分组",
      dataIndex: "_group",
      align: "center",
    },
    {
      title: "必填",
      dataIndex: "_write",
      align: "center",
      render: (text) => <Checkbox checked={!!text} disabled />,
    },
    {
      title: "只读",
      dataIndex: "_read",
      align: "center",
      render: (text) => <Checkbox checked={!!text} disabled />,
    },
    {
      title: "事件",
      align: "center",
      render: (text, record) => (
        <span>
          <ThunderboltOutlined />
        </span>
      ),
    },
  ];
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const initWidget = () => {
    setDataSource(
      Object.values(props.flatLayoutItems)
        .filter((item) => item.widgetRef !== "FormButton")
        .map((item) => {
          const {
            id,
            widgetRef,
            propState: { title, widgetCode },
          } = item;
          return {
            id,
            title,
            widgetCode,
            widgetRef,
            key: id,
            // TODO: 以下参数属于 3.2
            _group: "",
            _show: false,
            _write: false,
            _read: false,
          };
        })
    );
  };

  useEffect(() => {
    initWidget();
  }, [props.flatLayoutItems]);

  return (
    <>
      <Alert
        style={{ margin: "5px 0" }}
        message="注意：显示，必填，只读（属性）属于 3.2"
        type="info"
        showIcon
      />
      <Table<ITableItem>
        components={{ body: { row: EditableRow, cell: EditableCell } }}
        bordered
        dataSource={dataSource}
        columns={columns}
        size="small"
      />
    </>
  );
};
