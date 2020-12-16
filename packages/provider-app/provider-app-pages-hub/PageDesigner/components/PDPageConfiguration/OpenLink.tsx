import React, { useEffect, useState } from "react";
import { Form, Input, Button, Radio, Select, Space, Table } from "antd";
import pick from "lodash/pick";
import { getPageListServices } from "@provider-app/page-manager/services/apis";
import { getPageDetailService } from "@provider-app/services";
import { ValueHelper } from "@provider-app/page-designer/components/PDInfraUI";
import { SyncOutlined } from "@ant-design/icons";
import {
  OpenPageInApp,
  BasicValueMeta,
} from "@engine/visual-editor/data-structure";
import { VarAttrTypeMap } from "./PageVariableSelector";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface IOnSuccessParams {
  id: string;
  name: string;
}

interface IProps {
  onSuccess: (item: IOnSuccessParams, name: string) => void;
  onCancel: () => void;
  config: OpenPageInApp;
  platformCtx;
}

const OPEN_TYPE_MENU = [
  {
    label: "覆盖当前页面",
    value: "replaceCurrentPage",
    key: "replaceCurrentPage",
  },
  { label: "弹窗页面", value: "openModal", key: "openModal" },
  { label: "新浏览器tab页", value: "newTabInBrowser", key: "newTabInBrowser" },
  { label: "应用内页面跳转", value: "newTabInApp", key: "newTabInApp" },
];
const PAGE_AREA_MENU = [
  { label: "配置页面", value: "pageInApp", key: "pageInApp" },
  { label: "非配置页面（未实现）", value: "pageOutApp", key: "pageOutApp" },
];
const PAGE_TYPE_MENU = [
  { label: "地址（未实现）", value: "address", key: "address" },
  { label: "功能码（未实现）", value: "funcCode", key: "funcCode" },
];
type PageItem = {
  label: string;
  value: string;
  key: string;
};
type InputVarItem = {
  alias: string;
  id: string;
  varType: string;
};
type FormValues = {
  openType:
    | "replaceCurrentPage"
    | "openModal"
    | "newTabInBrowser"
    | "newTabInApp";
  pageArea: "pageInApp" | "pageOutApp";
  link: string;
  pageType?: "address" | "funcCode";
};

const InputVarList = ({
  pageId,
  platformCtx,
  inputVarConfig,
  setBasicValueMeta,
}) => {
  /** 页面对应入参列表 */
  const [inputVarList, setInputVarList] = useState<InputVarItem[]>([]);
  const [listRenderReady, setListRenderReady] = useState<boolean>(false);
  /** 当前页面变量数据 */
  const [variableData, setVariableData] = useState({});
  useEffect(() => {
    updateVarList();
    /** 获取当前页面变量 */
    platformCtx.meta.getVariableData([]).then((res) => {
      setVariableData(res);
    });
  }, [pageId]);

  const updateVarList = async () => {
    setListRenderReady(false);
    const getInputVarOrder = (item) => {
      return item.id.split(".")[2] - 0;
    };
    const { pageContent } = await getPageDetailService(pageId); // eslint-disable-line no-unused-vars
    const varRely = pageContent?.meta?.varRely;
    const { pageInput } = await platformCtx.meta.getVariableData(
      ["widget", "system", "page", "customed"],
      { varRely }
    );
    setInputVarList(
      pageInput.sort((a, b) => getInputVarOrder(b) - getInputVarOrder(a))
    );
    setListRenderReady(true);
  };

  return (
    <Table
      dataSource={inputVarList}
      columns={[
        {
          dataIndex: "title",
          key: "title",
          width: 300,
          title: () => {
            return (
              <>
                <span>输入参数名称</span>
                <SyncOutlined
                  spin={!listRenderReady}
                  className="ml-1"
                  style={{ verticalAlign: "baseline" }}
                  onClick={updateVarList}
                />
              </>
            );
          },
        },
        {
          dataIndex: "varType",
          key: "varType",
          title: "类型",
          width: 100,
          render: (_t) => VarAttrTypeMap[_t],
        },
        {
          dataIndex: "id",
          key: "id",
          title: "值",
          width: 400,
          render: (_t, _r, _i) => {
            return (
              <ValueHelper
                platformCtx={platformCtx}
                editedState={inputVarConfig[_t] || {}}
                onChange={(changeArea) => {
                  setBasicValueMeta({
                    ...inputVarConfig,
                    [_t]: changeArea,
                  });
                }}
                variableData={variableData}
              />
            );
          },
        },
      ]}
      rowKey="id"
      size="small"
      pagination={false}
      scroll={{ y: 300 }}
    />
  );
};
export const OpenLink = ({
  onSuccess,
  onCancel,
  config: data,
  platformCtx,
}: IProps) => {
  /** 表单数据 */
  const [form] = Form.useForm<FormValues>();
  /** 配置页面列表 */
  const [pageList, setPageList] = useState<PageItem[]>([]);
  /** 输入参数配置 */
  const [inputVarConfig, setBasicValueMeta] = useState<BasicValueMeta>({});

  /**
   * 提交表单数据
   */
  const onFinish = (values) => {
    const { openType, pageArea, link } = values; // eslint-disable-line no-unused-vars
    /** 打开方式 */
    const openTypeCn = OPEN_TYPE_MENU.filter(
      (item) => item.value === openType
    )[0]?.label;
    /** 打开页面 */
    let pageNameCn = link;
    if (pageArea === "pageInApp") {
      pageNameCn = pageList.filter((item) => item.value === link)[0]?.label;
    }
    onSuccess(
      { ...values, paramMatch: inputVarConfig },
      `以 ${openTypeCn} 打开 ${pageNameCn}`
    );
  };

  useEffect(() => {
    /** 获取应用内列表数据 */
    getPlatformPage();
    /** 初始化表单数据，做些默认值设置 */
    const values = pick(
      data || {
        openType: "openModal",
        pageArea: "pageInApp",
      },
      ["openType", "pageArea", "pageType", "link"]
    );
    form.setFieldsValue(values);
    setBasicValueMeta(data?.paramMatch || {});
  }, []);

  const filterOption = (value, option) => {
    if (!value) return true;
    return option?.label?.toLowerCase()?.includes(value.toLowerCase());
  };
  /**
   * 获取应用内列表数据
   */
  const getPlatformPage = () => {
    getPageListServices({}).then((pageListRes) => {
      let pageListTmpl = pageListRes.result?.data || [];
      if (Array.isArray(pageListTmpl)) {
        pageListTmpl = pageListTmpl.map((item) => {
          return { label: item.name, value: item.id, key: item.id };
        });
      } else {
        pageListTmpl = [];
      }
      setPageList(pageListTmpl);
    });
  };
  /**
   * 清空数据
   */
  const onReset = () => {
    form.resetFields();
    /** 还原默认值配置 */
    form.setFieldsValue({
      openType: "openModal",
      pageArea: "pageInApp",
    });
  };

  const updateInputVar = async (value) => {
    setBasicValueMeta({});
  };

  return (
    <>
      <Form
        {...layout}
        form={form}
        name="open-page"
        onFinish={onFinish}
        initialValues={{
          type: 1,
          belongMenus: [],
        }}
      >
        <Form.Item
          name="openType"
          label="打开方式"
          rules={[
            {
              required: true,
              message: "打开方式必填",
            },
          ]}
        >
          <Select options={OPEN_TYPE_MENU} />
        </Form.Item>
        <Form.Item
          name="pageArea"
          label="链接地址"
          rules={[{ required: true, message: "链接地址必填" }]}
        >
          <Radio.Group
            options={PAGE_AREA_MENU}
            onChange={(value) => {
              form.setFieldsValue({ link: "" });
              setBasicValueMeta({});
            }}
          />
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const pageArea = getFieldValue("pageArea");
            return pageArea === "pageInApp" ? (
              <Form.Item name="link" label="链接页面">
                <Select
                  showSearch
                  filterOption={filterOption}
                  onChange={updateInputVar}
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
                    defaultValue="address"
                    options={PAGE_TYPE_MENU}
                  />
                </Form.Item>
                <Form.Item
                  name="link"
                  label="链接页面"
                  rules={[{ required: true, message: "链接页面必填" }]}
                >
                  <Input placeholder="请输入页面跳转链接或功能码" />
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prev, current) =>
            prev.link !== current.link || prev.pageArea !== current.pageArea
          }
        >
          {({ getFieldValue }) => {
            if (
              getFieldValue("link") &&
              getFieldValue("pageArea") === "pageInApp"
            ) {
              return (
                <InputVarList
                  platformCtx={platformCtx}
                  pageId={getFieldValue("link")}
                  inputVarConfig={inputVarConfig}
                  setBasicValueMeta={setBasicValueMeta}
                />
              );
            }
            return null;
          }}
        </Form.Item>

        <Form.Item {...tailLayout} style={{ marginBottom: 0, marginTop: 5 }}>
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
    </>
  );
};
