import React, { useEffect, useState } from "react";
import { Form, Radio, Button, Input, Table, message as AntMessage } from "antd";
import { CloseModal, ShowModal, TreeSelector } from "@infra/ui";
import { VariableItem } from "@provider-app/page-designer/platform-access";
import { getTableInfo } from "@provider-app/table-editor/apis";
import { ModalConfigSelector } from "./ModalConfigSelector";
import { ModalConfigEditor } from "./ModalConfigEditor";

const VariableMatch = ({ dataSource, variableData, matchPair, onChange }) => {
  const initVariableList = () => {
    const constructVarList = (list: VariableItem[]) => {
      return Array.isArray(list)
        ? list.map((item) => constructVarItem(item))
        : [];
    };
    const constructVarItem = (item: VariableItem) => {
      const { id, title } = item;
      return { value: id, title };
    };
    return [
      {
        title: "自定义变量",
        value: "customed",
        variableList: variableData.customed,
        disabled: true,
      },
      {
        title: "页面变量",
        value: "page",
        variableList: variableData.page,
        disabled: true,
      },
      {
        title: "系统变量",
        value: "system",
        variableList: variableData.system,
        disabled: true,
      },
      {
        title: "控件变量",
        value: "widget",
        variableList: variableData.widget,
        disabled: true,
      },
      {
        title: "输入参数变量",
        value: "pageInput",
        variableList: variableData.pageInput,
        disabled: true,
      },
    ]
      .filter((item) => item.variableList?.length > 0)
      .map((item) => {
        const { variableList, ...rest } = item;
        return { ...rest, children: constructVarList(variableList) };
      });
  };
  return (
    <Table
      dataSource={dataSource}
      rowKey="columnID"
      columns={[
        {
          dataIndex: "columnTitle",
          title: "字段名称",
          key: "columnTitle",
        },
        {
          dataIndex: "columnID",
          title: "变量",
          key: "columnID",
          render: (_t) => {
            return (
              <TreeSelector
                value={matchPair[_t] || ""}
                className="variable-selector py-1 cursor-pointer"
                showSearch
                filterTreeNode={(value, treeNode) => {
                  return (
                    (treeNode?.title || "").toString().includes(value) || false
                  );
                }}
                onChange={(value) => {
                  if (typeof onChange === "function") {
                    onChange({ [_t]: value });
                  }
                }}
                treeDefaultExpandAll
                treeData={initVariableList()}
              />
            );
          },
        },
      ]}
    />
  );
};
export const ChooseData = ({
  onSuccess,
  onCancel,
  config,
  platformCtx,
  configCn: configCnProp,
}) => {
  const [form] = Form.useForm();
  const [extraConfig, setExtraConfig] = useState({
    returnValueList: [],
    returnTextList: [],
    configCn: configCnProp || "配置弹窗",
  });
  useEffect(() => {
    const {
      createdBy = "modalList",
      dataChooseRange,
      matchReturnValue = [],
      matchReturnText = [],
      ...modalConfig
    } = config || {};
    console.log(createdBy);
    form.setFieldsValue({
      createdBy,
      dataChooseRange,
      matchReturnValue,
      matchReturnText,
      modalConfig,
    });
    getModalExtraConfig(modalConfig);
  }, []);
  const getReturn = (modalConfig) => {
    const {
      showType,
      returnText,
      tableReturnText,
      returnValue,
      tableReturnValue,
      ds,
      tableDs,
    } = modalConfig || {};
    if ([1, 2].includes(showType)) {
      return { ds, returnText, returnValue };
    }
    if (showType === 3) {
      return {
        ds: tableDs,
        returnText: tableReturnText,
        returnValue: tableReturnValue,
      };
    }
    return {};
  };
  const getFieldTitle = (tableId): Promise<{ [key: string]: string }> => {
    return new Promise((resolve, reject) => {
      $R_P
        .post({
          url: "/data/v1/tables/tableWithAux",
          data: {
            tables: [
              {
                tableId,
                addWithAuxTable: true,
              },
            ],
          },
        })
        .then((res) => {
          if (res?.code !== "00000") {
            AntMessage.error("获取表详情数据失败，请联系技术人员");
            return;
          }
          const result = {};
          res.result.forEach((ds) => {
            ds.columns.forEach((item) => {
              result[`${ds.id}.${item.id}`] = item.name;
            });
          });
          resolve(result);
        });
    });
  };
  const getModalExtraConfig = (modalConfig) => {
    debugger;
    const { ds, returnText, returnValue } = getReturn(modalConfig);
    if (!ds) return;
    getFieldTitle(ds).then((fields) => {
      const { configCn } = modalConfig || {};
      setExtraConfig({
        configCn,
        returnTextList: returnText.map((columnID) => ({
          columnID,
          columnTitle: fields[columnID],
        })),
        returnValueList: returnValue.map((columnID) => ({
          columnID,
          columnTitle: fields[columnID],
        })),
      });
    });
  };
  const handleModalConfig = () => {
    const createdBy = form.getFieldValue("createdBy");
    const handleSuccess = (modalConfig) => {
      form.setFieldsValue({
        modalConfig,
        matchReturnValue: {},
        matchReturnText: {},
      });
      getModalExtraConfig(modalConfig);
      CloseModal(modalID);
    };
    const modalID = ShowModal({
      title: "配置弹窗",
      width: 900,
      children: () => {
        return (
          <div className="p-5">
            {createdBy === "modalList" ? (
              <ModalConfigSelector
                platformCtx={platformCtx}
                selectedKey={form.getFieldValue("modalConfig")?.title}
                onSuccess={handleSuccess}
                onCancel={() => {
                  CloseModal(modalID);
                }}
              />
            ) : (
              <ModalConfigEditor
                platformCtx={platformCtx}
                config={form.getFieldValue("modalConfig")}
                onSuccess={handleSuccess}
                onCancel={() => {
                  CloseModal(modalID);
                }}
              />
            )}
          </div>
        );
      },
    });
  };
  return (
    <Form form={form}>
      <Form.Item name="createdBy" label="弹窗来源">
        <Radio.Group
          onChange={(e) => {
            form.setFieldsValue({
              modalConfig: undefined,
              matchReturnValue: {},
              matchReturnText: {},
            });
            setExtraConfig({
              returnTextList: [],
              returnValueList: [],
              configCn: "配置弹窗",
            });
          }}
        >
          <Radio value="modalList">选择模板</Radio>
          <Radio value="config">自定义弹窗</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="配置弹窗">
        <Button
          onClick={() => {
            handleModalConfig();
          }}
        >
          {extraConfig.configCn}
        </Button>
      </Form.Item>

      <Form.Item label="数据检索范围" name="dataChooseRange">
        <Input placeholder="暂不支持" />
      </Form.Item>
      <div>返回值匹配：</div>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue, setFieldsValue }) => {
          return (
            <VariableMatch
              dataSource={extraConfig.returnValueList}
              variableData={{}}
              matchPair={getFieldValue("matchReturnValue") || {}}
              onChange={(changeArea) => {
                setFieldsValue({
                  ...(getFieldValue("matchReturnValue") || {}),
                  ...changeArea,
                });
              }}
            />
          );
        }}
      </Form.Item>
    </Form>
  );
};
