import React, { useEffect, useState } from "react";
import {
  Form,
  Radio,
  Button,
  Input,
  Table,
  message as AntMessage,
  Space,
} from "antd";
import { CloseModal, ShowModal, TreeSelector } from "@infra/ui";
import { VariableItem } from "@provider-app/page-designer/platform-access";
import pick from "lodash/pick";
import { ModalConfigSelector } from "./ModalConfigSelector";
import { ModalConfigEditor } from "./ModalConfigEditor";

const VariableRenderer = ({
  field,
  value,
  matchPair,
  onChange,
  variableList: variableListProp,
}) => {
  // const [variableList, setVariableList] = useState(variableListProp);
  // useEffect(() => {
  //   if (!matchPair || Object.keys(matchPair).length === 0) {
  //     setVariableList(variableListProp);
  //     return;
  //   }
  //   setVariableList(
  //     variableList
  //       .slice()
  //       .map((item) => {
  //         const { children, ...rest } = item;
  //         return {
  //           ...rest,
  //           children:
  //             (Array.isArray(children) &&
  //               children
  //                 .slice()
  //                 .filter(
  //                   ({ value: valueLoop }) =>
  //                     value === valueLoop ||
  //                     !Object.values(matchPair || {}).includes(valueLoop)
  //                 )) ||
  //             [],
  //         };
  //       })
  //       .filter((item) => item.children?.length > 0)
  //   );
  // }, [matchPair]);
  const getVariableList = () => {
    if (!matchPair || Object.keys(matchPair).length === 0) {
      return variableListProp;
    }
    return variableListProp
      .slice()
      .map((item) => {
        const { children, ...rest } = item;
        return {
          ...rest,
          children:
            (Array.isArray(children) &&
              children
                .slice()
                .filter(
                  ({ value: valueLoop }) =>
                    value === valueLoop ||
                    !Object.values(matchPair || {}).includes(valueLoop)
                )) ||
            [],
        };
      })
      .filter((item) => item.children?.length > 0);
  };
  return React.useMemo(() => {
    return (
      <TreeSelector
        value={value}
        className="w-full variable-selector py-1 cursor-pointer"
        showSearch
        filterTreeNode={(valueFilter, treeNode) => {
          return (
            (treeNode?.title || "").toString().includes(valueFilter) || false
          );
        }}
        onChange={(valueChanged) => {
          if (typeof onChange === "function") {
            onChange({ [field]: valueChanged });
          }
        }}
        treeDefaultExpandAll
        treeData={getVariableList()}
      />
    );
  }, [matchPair]);
};
const VariableMatch = ({ ds, fieldList, matchPair, onChange, platformCtx }) => {
  const [variableList, setVariableList] = useState({});
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    platformCtx.meta
      .getVariableData(["pageInput", "system", "page"])
      .then((res) => {
        setVariableList(initVariableList(res));
      });
  }, []);
  useEffect(() => {
    getFieldTitle(ds).then((fields) => {
      setDataSource(
        fieldList?.map((columnID) => ({
          columnID,
          columnTitle: fields[columnID],
        })) || []
      );
    });
  }, [ds]);
  const initVariableList = (variableData) => {
    if (!variableData) {
      return [];
    }
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
  const getFieldTitle = (tableId): Promise<{ [key: string]: string }> => {
    return new Promise((resolve, reject) => {
      if (!tableId) {
        resolve({});
        return;
      }
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
          res.result.forEach((table) => {
            table.columns.forEach((item) => {
              result[`${table.id}.${item.id}`] = item.name;
            });
          });
          resolve(result);
        });
    });
  };
  return (
    <Table
      dataSource={dataSource}
      rowKey="columnID"
      size="small"
      pagination={false}
      columns={[
        {
          dataIndex: "columnTitle",
          title: "字段名称",
          width: 400,
          key: "columnTitle",
        },
        {
          dataIndex: "columnID",
          title: "变量",
          width: 400,
          key: "columnID",
          render: (_t) => {
            return (
              <VariableRenderer
                matchPair={matchPair}
                variableList={variableList}
                value={matchPair[_t] || ""}
                field={_t}
                onChange={onChange}
              />
            );
          },
        },
      ]}
    />
  );
};
export class ChooseData extends React.Component {
  state = {
    createdBy: "modalList",
    dataChooseRange: undefined,
    matchReturnValue: {},
    modalConfig: undefined,
  };

  componentDidMount() {
    this.setState(
      pick(this.props.config, [
        "createdBy",
        "dataChooseRange",
        "matchReturnValue",
        "modalConfig",
      ])
    );
  }

  /** 从弹窗配置上获取对应的 ds，returnValue */
  getReturn = (modalConfig) => {
    const { showType, returnValue, tableReturnValue, ds, tableDs } =
      modalConfig || {};
    if ([1, 2].includes(showType)) {
      return { ds, fieldList: returnValue };
    }
    if (showType === 3) {
      return {
        ds: tableDs,
        fieldList: tableReturnValue,
      };
    }
    return {};
  };

  handleClick = () => {
    const { createdBy, modalConfig } = this.state;

    const handleSuccess = (modal) => {
      this.setState({
        modalConfig: modal,
        matchReturnValue: {},
      });
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
                platformCtx={this.props.platformCtx}
                selectedModal={modalConfig?.id}
                selectType="radio"
                onSuccess={handleSuccess}
                onCancel={() => {
                  CloseModal(modalID);
                }}
              />
            ) : (
              <ModalConfigEditor
                platformCtx={this.props.platformCtx}
                config={modalConfig}
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

  handleReset = () => {
    this.setState({
      createdBy: "modalList",
      matchReturnValue: {},
      modalConfig: undefined,
      dataChooseRange: undefined,
    });
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  handleSubmit = () => {
    const { modalConfig, matchReturnValue } = this.state;
    if (!modalConfig) {
      AntMessage.error("请配置弹窗");
      return;
    }
    const isNotEmpty = () => {
      const arr = Object.values(matchReturnValue);
      return arr.length > 0 && arr.some((item) => !!item);
    };
    const amINotEmpty = isNotEmpty();
    if (!amINotEmpty) {
      AntMessage.error("请配置返回值");
      return;
    }
    this.props.onSuccess(this.state, modalConfig.title);
  };

  render() {
    const { modalConfig, matchReturnValue, createdBy } = this.state;
    return (
      <>
        <div className="row mb-2">
          <span>弹窗来源：</span>
          <Radio.Group
            value={createdBy}
            onChange={(e) => {
              this.setState({
                modalConfig: undefined,
                matchReturnValue: {},
                createdBy: e.target.value,
              });
            }}
          >
            <Radio value="modalList">选择模板</Radio>
            <Radio value="config">自定义弹窗</Radio>
          </Radio.Group>
          <Button onClick={this.handleClick} className="ml-3">
            {modalConfig?.title || "配置弹窗"}
          </Button>
        </div>
        <div className="row flex">
          <span>数据检索范围：</span>
          <div className="flex">
            <Input placeholder="暂不支持" />
          </div>
        </div>
        <div>返回值匹配：</div>
        <VariableMatch
          {...this.getReturn(modalConfig)}
          platformCtx={this.props.platformCtx}
          matchPair={matchReturnValue || {}}
          onChange={(changeArea) => {
            this.setState({
              matchReturnValue: {
                ...(matchReturnValue || {}),
                ...changeArea,
              },
            });
          }}
        />
        <div className="float-right p-3">
          <Button htmlType="button" onClick={this.handleReset} className="mr-2">
            清空
          </Button>
          <Button type="primary" onClick={this.handleSubmit} className="mr-2">
            确定
          </Button>
          <Button htmlType="button" onClick={this.handleCancel}>
            取消
          </Button>
        </div>
      </>
    );
  }
}
export const xx = ({
  onSuccess,
  onCancel,
  config,
  platformCtx,
  configCn: configCnProp,
}) => {
  const [form] = Form.useForm();
  const [extraConfig, setExtraConfig] = useState({
    returnValueList: [],
    configCn: configCnProp || "配置弹窗",
  });
  useEffect(() => {
    const {
      createdBy = "modalList",
      dataChooseRange,
      matchReturnValue = [],
      ...modalConfig
    } = config || {};
    form.setFieldsValue({
      createdBy,
      dataChooseRange,
      matchReturnValue,
      modalConfig,
    });
    getModalExtraConfig(modalConfig);
  }, []);
  const getReturn = (modalConfig) => {
    const { showType, returnValue, tableReturnValue, ds, tableDs } =
      modalConfig || {};
    if ([1, 2].includes(showType)) {
      return { ds, returnValue };
    }
    if (showType === 3) {
      return {
        ds: tableDs,
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
    const { ds, returnValue } = getReturn(modalConfig);
    if (!ds) return;
    getFieldTitle(ds).then((fields) => {
      console.log(fields);
      console.log(returnValue);
      const { title: configCn } = modalConfig || {};
      setExtraConfig({
        configCn,
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
                selectedModal={form.getFieldValue("modalConfig")?.id}
                selectType="radio"
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
  const handleReset = () => {
    form.setFieldsValue({
      createdBy: "modalList",
      matchReturnValue: {},
      modalConfig: undefined,
      dataChooseRange: undefined,
    });
    setExtraConfig({
      configCn: "配置弹窗",
      returnValueList: [],
    });
  };
  const handleFinish = (data) => {
    const { configCn } = extraConfig;
    console.log(data);
    onSuccess(data, configCn);
  };
  return (
    <Form form={form} onFinish={handleFinish}>
      <Form.Item name="createdBy" label="弹窗来源">
        <Radio.Group
          onChange={(e) => {
            form.setFieldsValue({
              modalConfig: undefined,
              matchReturnValue: {},
            });
            setExtraConfig({
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
              platformCtx={platformCtx}
              matchPair={getFieldValue("matchReturnValue") || {}}
              onChange={(changeArea) => {
                setFieldsValue({
                  matchReturnValue: {
                    ...(getFieldValue("matchReturnValue") || {}),
                    ...changeArea,
                  },
                });
              }}
            />
          );
        }}
      </Form.Item>
      <Form.Item className="float-right w-full">
        <Space className="float-right">
          <Button htmlType="button" onClick={handleReset}>
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
