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
  Tooltip,
  message
} from "antd";
import { EditorFromTextArea } from "codemirror";
import { VariableItem } from "@provider-app/page-designer/platform-access";
import codeEngine from "@engine/low-code";
import createSandbox from "@engine/js-sandbox";
import { PlatformCtx } from "@platform-widget-access/spec";
import { HY_METHODS } from "@library/expression-methods";
import { ExclamationCircleOutlined } from '@ant-design/icons';
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

interface ISubmitRes {code: string | null, variable: { field: string, value: string }[]}
interface IProps {
  metaCtx: PlatformCtx["meta"];
  /** 表达式提交回调函数 */
  onSubmit: (transformRes: ISubmitRes) => void;
  defaultValue?: ISubmitRes;
}

interface ITransformRes {
  code: string;
  fieldMap: { [key: string]: string };
  titleMap: { [key: string]: string };
}

type TVariableItem = VariableItem & { field: string };
type TVariableTree<T> = { [key: string]: T[] };
export const Expression: React.FC<IProps> = (props) => {
  /** 编辑器对象 */
  const [editor, setEditor] = useState<EditorFromTextArea | null>(null);
  /** 编辑器是否准备就绪 */
  const [ready, setReady] = useState<boolean>(false);
  const [defaultCode, setDefaultCode] = useState<string>(false);
  /** 当前正在查看简介的函数对象 */
  const [curFunction, setCurFunction] = useState<IHyMethod | null>(null);
  /** 用于调试的变量-键值对，用于沙箱的上下文 */
  const [debugCodeValue, setDebugCodeValue] = useState<{ [key: string]: number | string }>({});
  /** 变量分类内标题是否重复 */
  const [variableTitleRepeat, setVariableTitleRepeat] = useState<{ [key: string]: boolean }>({});
  /** 变量是否正在编辑-键值对 */
  const [variableVisible, setVariableVisible] = useState<{ [key: string]: boolean }>({});
  /** 变量树 */
  const [variableTree, setVariableTree] = useState<TVariableTree<TVariableItem>>({});
  /** 编辑器下拉提示 */
  // const [hintOptions, setHintOptions] = useState<{ completeSingle: boolean; keywords: string[] }>({
  //   completeSingle: false,
  //   keywords: []
  // });
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
   * 替换变量的特殊字符 . (在低代码引擎中会误认为获取对象键值)
   */
  const formatVariable = (res: TVariableTree<VariableItem>): TVariableTree<TVariableItem> => {
    const obj = {};
    Object.keys(res).forEach((type) => {
      obj[type] = res[type].map((item) => ({
        ...item,
        field: `${type}$${item.id?.replace(/\./g, "$")}`,
        title: item.title?.replace(/\./g, "")
      }));
    });
    return obj;
  };
  /**
   * 检查变量分类内标题是否重复
   * @param res
   */
  const checkVariableTitle = (res: TVariableTree<TVariableItem>): void => {
    setVariableTitleRepeat(Object.keys(res).reduce((a, b) => {
      const tmp = res[b].map((item)=>item.title);
      for(let i = 0; i < tmp.length; i++){
        if(tmp.indexOf(tmp[i]) !== tmp.lastIndexOf(tmp[i])){
          a[b]= true;
          break;
        }
      }
      return a;
    }, {}));
  };
  /**
   * 根据变量类型初始化变量编辑组件
   */
  const initVariableEdit = (varType: string, field: string) => {
    switch (varType) {
      case "number":
        return (
          <InputNumber
            onPressEnter={(e) => {
              setDebugCodeValue((preDebugCodeValue) => ({
                ...preDebugCodeValue,
                [field]: e.target.value
              }));
              setVariableVisible((pre) => ({
                ...pre,
                [field]: !pre[field]
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
                [field]: e.target.value
              }));
              setVariableVisible((pre) => ({
                ...pre,
                [field]: !pre[field]
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
   * 选择变量
   * @param variable
   */
  const selectVariable = (variable: TVariableItem) => {
    // insertValue(variable.title, 0);
    if (!editor) return;
    const preCur = editor.getCursor();
    editor.replaceRange(variable.title, preCur, preCur, '+insert');
    const cur = editor.getCursor();
    editor.doc.markText(preCur, cur, { className: "cm-field cm-field-value", attributes: { "data-id": variable.id, "data-field": variable.field }, atomic: true });
    editor.focus();
  };
  /**
   * 选择方法，异步函数需要多加 await
   */
  const selectMethod = (item: IHyMethod) => {
    insertValue(`${item.type === "ASYNC" ? "await " : ""}${item.namespace}.${item.name}()`, 1);
    setCurFunction(item);
  };
  /**
   * 保存表达式
   */
  const onSubmit = () =>{
    if (!editor) return;
    const code = editor.getValue();
    if (code) {
      try {
        const { code, fieldMap } = replaceVariablesTitleToId();
        if(code && fieldMap){
          props.onSubmit && props.onSubmit({ code, variable: Object.keys(fieldMap).reduce((a, b)=>{
            a.push({
              field: b,
              value: fieldMap[b]
            });
            return a;
          }, [] as ISubmitRes['variable']) });
        } else {
          message.error("生成代码失败，请检查表达式是否无误");
        }
      } catch (error) {
        message.error("生成代码失败，请检查表达式是否无误");
      }
    } else {
      props.onSubmit && props.onSubmit({ code: null, variable: [] });
    }
  };
  /**
   * 转换编辑器内容为低代码字符串和包含变量
   * @param str 编辑器内容
   */
  const replaceVariablesTitleToId = (): ITransformRes => {
    if (!editor) return { code: "", fieldMap: {}, titleMap: {} };
    let code = "";
    const fieldMap = {};
    const titleMap = {};
    editor.doc.eachLine((line) => {
      let lineText = line.text;
      const tmp: {title: string, field: string}[] = [];
      const sortMarks = line.markedSpans?.sort((a, b) => a.from - b.from);
      sortMarks.forEach((textMark) => {
        if(textMark.marker.className?.indexOf("cm-field") !== -1) {
          const title = line.text.substring(textMark.from, textMark.to);
          const field = textMark.marker.attributes["data-field"];
          const id = textMark.marker.attributes["data-id"];
          tmp.push({ title, field });
          fieldMap[field] = id;
          titleMap[field] = title;
        }
      });
      tmp.forEach(({ title, field })=>{
        lineText = lineText.replace(title, field);
      });
      code += lineText;
    });
    return { code, fieldMap, titleMap };
  };
  /**
   * 检查变量的设置值是否满足调试需要
   * @param { fieldMap, titleMap } 字段映射和标题映射
   * @param Values 变量设置值键值对
   */
  const checkDebugCodeContext = ({ fieldMap, titleMap }: ITransformRes, Values: { [key: string]: number | string }): boolean => {
    let success = true;
    for (let i = 0, fieldMapKey = Object.keys(fieldMap); i < fieldMapKey.length; i++) {
      if(!Values[fieldMapKey[i]]) {
        message.error(`缺少调试变量 ${titleMap[fieldMapKey[i]]}`);
        success = false;
        break;
      }
    }
    return success;
  };
  /**
   * 调试代码
   */
  const debugCode = async () => {
    if (!editor) return;
    const code = editor.getValue();
    console.log("编辑器内容", code);
    if (code) {
      try {
        // console.dir("低代码引擎处理结果: ", str);
        const transformRes = replaceVariablesTitleToId();
        console.log("转换结果: ", transformRes);
        console.log("变量上下文: ", debugCodeValue);
        // 检查所需参数/变量是否存在
        if (checkDebugCodeContext(transformRes, debugCodeValue)) {
          const str = codeEngine(code, {});
          console.dir("低代码引擎处理结果: ", str);
          const sandbox = createSandbox({ ...debugCodeValue, HY }, {});
          const res = await sandbox(transformRes.code);
          console.log("调试结果: ", res);
          message.success(`调试结果: ${res}`);
          setOperationResult(res);
        }
      } catch (error) {
        console.dir("调试失败: ", error);
        setOperationResult(error.toString());
        message.error(`调试失败，${error.message}`);
      }
    } else {
      message.warn("编辑器没有内容");
    }
  };

  useEffect(() => {
    console.log("初始值: ", props.defaultValue);
    props.metaCtx.getVariableData(["page", "pageInput"]).then((res) => {
      // 替换特殊字符 . 为 _
      const variable = formatVariable(res);
      // 检查变量标题是否存在重复
      checkVariableTitle(variable);
      // 生成选择变量（折叠面板）所需数据
      setVariableTree(variable);
      // 初始化默认值
      if (props.defaultValue && props.defaultValue.code && props.defaultValue.variable) {
        let isNormal = true;
        let code = props.defaultValue.code;
        const useVariable = props.defaultValue.variable;
        for (let j = 0; j < useVariable.length; j++) {
          const { field } = useVariable[j];
          let has = false;
          for (let i = 0, list = Object.keys(variable); i < list.length; i++) {
            const item = variable[list[i]].find((item) => item.field === field);
            if (item) {
              has = true;
              code = code.replace(new RegExp(item.field.replace(/\$/g, "\\$"), "g"), item.title);
            }
          }
          if (!has) {
            isNormal = false;
            message.error(`变量已移除，表达式失效`);
            break;
          }
        }
        if (isNormal) {
          console.log("初始编辑器内容", code);
          setDefaultCode(code);
        }
      }
      console.log("全部变量: ", res, variable);
    });
  }, [props.defaultValue]);

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
              defaultValue={defaultCode || ""}
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
                    <Panel header={<Space className="expression-option-title"><span>{VARIABLE_TYPE[type]}</span>{variableTitleRepeat && variableTitleRepeat[type] && <Tooltip title="标题存在重复，请注意区分"><ExclamationCircleOutlined style={{ color: "#ffe58f" }} /></Tooltip>}</Space>} key={type}>
                      <List
                        size="small"
                        bordered={false}
                        dataSource={variableTree[type]}
                        renderItem={(item: TVariableItem) => (
                          <List.Item
                            actions={[
                              <Tag color="processing">{VAR_VALUE_TYPE[item.varType]}</Tag>,
                              <Popover
                                visible={!!variableVisible[item.field]}
                                content={initVariableEdit(item.varType, item.field)}
                                trigger="click"
                              >
                                <Tag
                                  color="success"
                                  onClick={() => {
                                    setVariableVisible((pre) => ({
                                      ...pre,
                                      [item.field]: !pre[item.field]
                                    }));
                                  }}
                                >
                                  {debugCodeValue[item.field] || "编辑"}
                                </Tag>
                              </Popover>
                            ]}
                          >
                            <span
                              onClick={() => {
                                selectVariable(item);
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
