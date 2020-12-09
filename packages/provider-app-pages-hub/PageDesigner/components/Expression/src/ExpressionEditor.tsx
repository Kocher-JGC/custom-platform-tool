import React, { Suspense, useEffect, useState } from "react";
import {
  Spin,
  Space,
  Button,
  Row,
  Col,
  Collapse,
  List,
  Descriptions,
  Tag,
  Popover,
  Input,
  InputNumber,
  message
} from "antd";
import { Editor } from "codemirror";
import { VariableItem } from "@provider-app/page-designer/platform-access";
import codeEngine from "@engine/low-code";
import createSandbox from "@engine/js-sandbox";
import { PlatformCtx } from "@platform-widget-access/spec";
import { HY_METHODS } from "@library/expression-methods";
import { SHOW_FUNCTION_FIELD, HY_METHODS_TYPE, VARIABLE_TYPE, VAR_VALUE_TYPE } from "./constants";
import { IHyMethod } from "./interface";
import "./index.less";

const { Panel } = Collapse;
const methodsTree = HY_METHODS.reduce((a, b) => {
  if (a[b.type]) {
    a[b.type].push(b);
  } else {
    a[b.type] = [b];
  }
  return a;
}, {});
const HY = HY_METHODS.reduce((a, b) => {
  a[b.name] = b.execute;
  return a;
}, {});

const ExpressionEditor = React.lazy(
  () => import(/* webpackChunkName: "code_editor" */ "@engine/code-editor")
);
interface IProps {
  metaCtx: PlatformCtx["meta"];
  /** 表达式提交回调函数 */
  onSubmit: (res: { value: string }) => void;
  defaultValue?: string;
}

export const Expression: React.FC<IProps> = (props) => {
  /** 编辑器对象 */
  const [editor, setEditor] = useState<Editor | null>(null);
  /** 编辑器是否准备就绪 */
  const [ready, setReady] = useState<boolean>(false);
  /** 当前正在查看简介的函数对象 */
  const [curFunction, setCurFunction] = useState<IHyMethod | null>(null);
  /** 用于调试的变量-键值对，用于沙箱的上下文 */
  const [debugCodeValue, setDebugCodeValue] = useState({});
  /** 变量是否正在编辑-键值对 */
  const [variableVisible, setVariableVisible] = useState({});
  /** 变量 key 值的显示值和实际值-键值对，用于低代码引擎替换变量 */
  const [variableMapping, setVariableMapping] = useState<{ [key: string]: string } | null>(null);
  /** 变量树 */
  const [variableTree, setVariableTree] = useState<{ [key: string]: VariableItem[] }>({});
  /** 编辑器下拉提示 */
  const [hintOptions, setHintOptions] = useState<{ completeSingle: boolean; keywords: string[] }>({
    completeSingle: false,
    keywords: []
  });
  /** 调试结果 */
  const [operationResult, setOperationResult] = useState("");

  /**
   * 编辑器插入值
   * @param code 指定字符串
   * @param pos 光标倒退几格
   */
  const insertValue = (code: string, pos = 0) => {
    if (!editor) return;
    const cur = editor.getCursor();
    editor.replaceRange(code, cur, cur, "+insert");
    setTimeout(() => {
      const cur = editor.getCursor();
      editor.setCursor({ line: cur.line, ch: cur.ch - pos });
      editor.focus();
    }, 500);
  };
  /**
   * 调试代码
   */
  const debugCode = async () => {
    if (!editor) return;
    const code = editor.getValue();
    console.log("编辑器内容", code);
    if (code && variableMapping) {
      try {
        const str = codeEngine(code, { identifierMapping: variableMapping });
        console.dir("低代码引擎处理结果: ", str);
        const context = getVariableValue();
        console.log("变量上下文: ", context);
        const sandbox = createSandbox({ ...context, HY }, {});
        const res = await sandbox(str);
        console.log("调试结果: ", res);
        message.success(`调试结果: ${res}`);
        setOperationResult(res);
      } catch (error) {
        console.dir("调试失败: ", error);
        setOperationResult(error.toString());
        message.error(`调试失败，${error.message}`);
      }
    }
  };
  /**
   * 初始化时格式化变量树
   */
  const initVariableMapping = (res) => {
    const obj = {};
    Object.keys(res).forEach((type) => {
      res[type].forEach((item) => {
        obj[item.title] = `${item.type}.${item.id}`;
      });
    });
    setVariableMapping(obj);
  };
  /**
   * 将用于调试的变量-键值对转换成沙箱可用的上下文
   */
  const getVariableValue = () => {
    const variableValue = {};
    Object.keys(debugCodeValue).forEach((key) => {
      const tmp = key.split("~");
      if (tmp[0] && tmp[1]) {
        if (!variableValue[tmp[0]]) variableValue[tmp[0]] = {};
        variableValue[tmp[0]][tmp[1]] = debugCodeValue[key];
      }
    });
    return variableValue;
  };
  /**
   * 替换变量的特殊字符 . (在低代码引擎中会误认为获取对象键值)
   */
  const replacePoint = (res: {
    [key: string]: VariableItem[];
  }): { [key: string]: VariableItem[] } => {
    const obj = {};
    Object.keys(res).forEach((type) => {
      obj[type] = res[type].map((item) => ({
        ...item,
        code: item.code?.replace(/\./g, "_"),
        id: item.id?.replace(/\./g, "_"),
        title: item.title?.replace(/\./g, "_")
      }));
    });
    return obj;
  };
  /**
   * 根据变量类型初始化变量编辑组件
   */
  const initVariableEdit = (varType: string, type: string, id: string) => {
    const type_id = `${type}~${id}`;
    switch (varType) {
      case "number":
        return (
          <InputNumber
            onPressEnter={(e) => {
              setDebugCodeValue((preDebugCodeValue) => ({
                ...preDebugCodeValue,
                [type_id]: e.target.value
              }));
              setVariableVisible((pre) => ({
                ...pre,
                [id]: !pre[id]
              }));
            }}
          />
        );
      case "string":
        return (
          <Input
            onPressEnter={(e) => {
              setDebugCodeValue((preDebugCodeValue) => ({
                ...preDebugCodeValue,
                [type_id]: e.target.value
              }));
              setVariableVisible((pre) => ({
                ...pre,
                [id]: !pre[id]
              }));
            }}
          />
        );
      case "date":
        break;
      case "dateTime":
        break;
      default:
        break;
    }
  };
  /**
   * 清除编辑器
   */
  const resetEditor = () => {
    setOperationResult("");
    if (!editor) return;
    editor.setValue("");
  };
  /**
   * 选择方法，异步函数需要多加 await
   */
  const selectMethod = (item: IHyMethod) => {
    insertValue(`${item.type === "ASYNC" ? "await " : ""}${item.namespace}.${item.name}()`, 1);
    setCurFunction(item);
  };

  const onSubmit = () =>{
    if (!editor) return;
    const code = editor.getValue();
    if (code && variableMapping) {
      try {
        // const value = codeEngine(code, { identifierMapping: variableMapping });
        props.onSubmit && props.onSubmit({ value: code });
      }catch (error){
        message.error("生成代码失败，请检查表达式是否无误");
      }
    }
  };

  useEffect(() => {
    props.metaCtx.getVariableData(["page", "pageInput"]).then((res) => {
      // 替换特殊字符 . 为 _
      const variable = replacePoint(res);
      setVariableTree(variable);
      initVariableMapping(variable);
      console.log("全部变量: ", res, variable);
    });
  }, []);

  return (
    <Suspense fallback={<span></span>}>
      <div className="expression">
        {/* <span>输出结果: {operationResult}</span> */}
        <Spin tip="初始化编辑器..." spinning={!ready} style={{ backgroundColor: "#fff" }}>
          <div className="expression-editor">
            <div className="expression-header">
              <span>{`结果 = ${operationResult || ""}`}</span>
              <Space size="small">
                <Button size="small" type="link" onClick={debugCode}>
                  调试
                </Button>
                <Button size="small" type="text" danger onClick={resetEditor}>
                  清除
                </Button>
              </Space>
            </div>
            <ExpressionEditor
              theme="ttcn"
              mode="javascript"
              lint={false}
              height="200px"
              defaultValue={props.defaultValue || ""}
              getEditor={(editor) => setEditor(editor)}
              ready={() => {
                setReady(true);
              }}
            />
            <div className="expression-footer">
              <span></span>
            </div>
          </div>
        </Spin>
        <Row gutter={8}>
          <Col span={12}>
            <section className="expression-option">
              <h4>可用变量</h4>
              <div className="expression-option-body">
                <Collapse defaultActiveKey={["1"]} bordered={false}>
                  {Object.keys(variableTree).map((type) => (
                    <Panel header={VARIABLE_TYPE[type]} key={type}>
                      <List
                        size="small"
                        bordered={false}
                        dataSource={variableTree[type]}
                        renderItem={(item: VariableItem) => (
                          <List.Item
                            actions={[
                              <Tag color="processing">{VAR_VALUE_TYPE[item.varType]}</Tag>,
                              <Popover
                                visible={!!variableVisible[item.id]}
                                content={initVariableEdit(item.varType, item.type, item.id)}
                                trigger="click"
                              >
                                <Tag
                                  color="success"
                                  onClick={() => {
                                    setVariableVisible((pre) => ({
                                      ...pre,
                                      [item.id]: !pre[item.id]
                                    }));
                                  }}
                                >
                                  {debugCodeValue[`${item.type}~${item.id}`] || "编辑"}
                                </Tag>
                              </Popover>
                            ]}
                          >
                            <span
                              onClick={() => {
                                insertValue(item.title, 0);
                              }}
                            >
                              {item.title}
                            </span>
                          </List.Item>
                        )}
                      />
                    </Panel>
                  ))}
                </Collapse>
              </div>
            </section>
          </Col>
          <Col span={5}>
            <section className="expression-option">
              <h4>函数</h4>
              <div className="expression-option-body">
                <Collapse bordered={false}>
                  {Object.keys(methodsTree).map((type) => (
                    <Panel key={type} header={`${HY_METHODS_TYPE[type]}函数`}>
                      <List
                        size="small"
                        bordered={false}
                        dataSource={methodsTree[type]}
                        renderItem={(item: IHyMethod) => (
                          <List.Item
                            onClick={() => {
                              selectMethod(item);
                            }}
                          >
                            {item.name}
                          </List.Item>
                        )}
                      />
                    </Panel>
                  ))}
                </Collapse>
              </div>
            </section>
          </Col>
          <Col span={7}>
            <section className="expression-option">
              <h4>函数描述</h4>
              <div className="expression-option-body" style={{ padding: 10 }}>
                {curFunction && (
                  <Descriptions column={1}>
                    <Descriptions.Item key="describe" label={SHOW_FUNCTION_FIELD.describe}>
                      {curFunction.describe || "待完善"}
                    </Descriptions.Item>
                    <Descriptions.Item key="usage" label={SHOW_FUNCTION_FIELD.usage}>
                      {curFunction.usage || "待完善"}
                    </Descriptions.Item>
                    <Descriptions.Item key="example" label={SHOW_FUNCTION_FIELD.example}>
                      {curFunction.example || "待完善"}
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </div>
            </section>
          </Col>
        </Row>
        <div className="expression-handle py-4">
          <span className="expression-handle-tip">请在英文输入法模式下编辑表达式</span>
          <Button type="primary" onClick={onSubmit}>
            确定
          </Button>
        </div>
      </div>
    </Suspense>
  );
};
