import React, { useState, useEffect, Suspense } from 'react';
import { Spin, Space, Button, Row, Col, Collapse, List, Descriptions } from 'antd';
import { PlatformCtx } from '@platform-widget-access/spec';
import codeEngine from '@engine/low-code';
import createSandbox from '@engine/js-sandbox';
import {
  IExpressionFunctionOptions,
  IExpressionVariableOptions,
  IExpressionGrammarOptions
} from './interface';
import { EXPRESSION_FUNCTION, SHOW_FUNCTION_FIELD } from './constants';
import './expressionEditor.less';

const { Panel } = Collapse;

const Editor = React.lazy(() => import(/* webpackChunkName: "code_editor" */'@engine/code-editor'));

export const Expression: React.FC<{ defaultValue: string, onSubmit: (value: string) => void, metaCtx: PlatformCtx['meta'] }>= (props, ref) => {
  const [editor, setEditor] = useState<any>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [
    curFunction,
    setCurFunction,
  ] = useState<IExpressionFunctionOptions | null>(null);
  const [
    hintOptions,
    setHintOptionsState
  ] = useState<{completeSingle: boolean; keywords: string[]}>({ completeSingle: false, keywords: [] });

  const delay = async (s: number) => new Promise((resolve) => { setTimeout(resolve, s); });

  const insertValue = async (code: string, pos = 0) => {
    const cur = editor.getCursor();
    editor.replaceRange(code, cur, cur, '+insert');
    await delay(50);
    const newCur = editor.getCursor();
    editor.setCursor({ line: newCur.line, ch: newCur.ch - pos });
  };

  const handleFunctionSelect = (item: IExpressionFunctionOptions, namespace: string) => {
    insertValue(`${namespace}_${item.title}()`, 1);
    editor.focus();
  };

  const handleVariableSelect = (item: IExpressionVariableOptions) => {
    insertValue(item.title);
  };

  const handleGrammarSelect = (item: IExpressionGrammarOptions) => {
    if (item.name === "IF_ELSE") {
      insertValue("if(condition){}else{}");
    }
  };

  const getVariableHintName = (): string[] => {
    const functionNames: string[] = [];
    EXPRESSION_FUNCTION.forEach((funType) => {
      funType.options.forEach((item) => {
        functionNames.push(`${funType.namespace}_${item.name}`);
      });
    });
    return functionNames;
  };

  /**
   * 获取变量字段和值的键值对, 用于运行表达式
   */
  const getVariableValue = () => {
    // const variable = {};
    // VARIABLE_DATA.map(item => {
    //   item.props.forEach(props => {
    //     const keys = props.key.split(".");
    //     if (!variable[keys[0]]) {
    //       variable[keys[0]] = {};
    //     }
    //     variable[keys[0]][keys[1]] = props.value;
    //   });
    // });
    // return variable;
  };

  /**
   * 获取所有变量键值对, 用于替换变量字段的显示值和实际值的替换
   */
  const variableMapping = () => {

  };

  /**
   * 调试代码
   */
  const debugCode = async () => {
    // const code = editor.getValue();
    const code = "if(张三==='123'){return 'yes';}else{return 'no';}";
    // const mappingSource = variableMapping("title", "key");
    const mappingSource = { "张三": "test" };
    if (code) {
      try {
        const str = codeEngine(code, { identifierMapping: mappingSource });
        console.dir(str);
        // const context = getVariableValue();
        const context = {};
        const sandbox = createSandbox({ ...context }, {});
        const res = await sandbox(str);
        console.log(res);
        // setOperationResult(res);
      } catch (error) {
        console.dir(error);
        // setOperationResult(error.toString());
      }
    }
  };

  const generateExpression = () => {
    const expression: string[] = [];
    editor.doc.eachLine((line)=>{
      let lineText = "";
      const sortMarks = line.markedSpans?.sort((a, b) => a.from - b.from);
      sortMarks.forEach((textMark) => {
        if (textMark.marker.className?.indexOf("cm-field") !== -1) {
          lineText += `__${textMark.marker.attributes["data-value"]}__`;
        } else {
          lineText += line.text.substring(textMark.from, textMark.to);
        }
      });
      expression.push(lineText);
    });
    console.log("expression", expression);
    return "test";
  };

  useEffect(() => {
    setHintOptionsState({
      completeSingle: false,
      keywords: getVariableHintName()
    });
    console.log(props);
    // platformCtx.meta.getVariableData(['page', 'pageInput']).then(res=>{
    //   setVariableList(getVariableList(res));
    //   setExpandedKeys(varTypeAllowChange);
    // });
    props.metaCtx.getVariableData(['page', 'pageInput']).then(res=>{
      console.log(res);
    });
  }, []);

  return (
    <Suspense fallback={<span></span>}>
      <div className='expression'>
        <Spin tip="初始化编辑器..." spinning={!ready} style={{ backgroundColor:"#fff" }}>
          <div className="expression-editor">
            <div className='expression-header'>
              <span>{"结果 ="}</span>
              <Space size="small">
                <Button size="small" type="link">调试</Button>
                <Button
                  size="small" type="text" danger onClick={() => {
                    editor.setValue("");
                  }}
                >清除</Button>
              </Space>
            </div>
            <Editor
              mode="javascript"
              renderToolBar={false}
              value={props.defaultValue}
              getEditor={(editor) => setEditor(editor)}
              onBeforeChange={(instance, changeObj)=>{}}
              onChange={(instance, changeObj) => {}}
              hintOptions={hintOptions}
              ready={()=>{
                setReady(true);
              }}
            />
            <div className='expression-footer'>
              <span></span>
            </div>
          </div>
        </Spin>

        <Row gutter={8}>
          <Col span={4}>
            <section className='expression-option'>
              <h4>可用代码块</h4>
              <div className='expression-option-body'>
                <Collapse defaultActiveKey={['1']} bordered={false}>
                  <Panel header='JS 条件' key='1'>
                    <List
                      size='small'
                      bordered={false}
                      dataSource={[
                        { title: 'if else', name: 'IF_ELSE' },
                      // { title: '三元运算符', value: 'TERNARY_OPERATOR' },
                      ]}
                      renderItem={(item: IExpressionGrammarOptions) => (
                        <List.Item
                          onClick={() => {
                            handleGrammarSelect(item);
                          }}
                        >
                          {item.title}
                        </List.Item>
                      )}
                    />
                  </Panel>
                </Collapse>
              </div>
            </section>
          </Col>
          <Col span={6}>
            <section className='expression-option'>
              <h4>可用变量</h4>
              <div className='expression-option-body'>
                <Collapse defaultActiveKey={['1']} bordered={false}>
                  <Panel header='系统变量' key='1'>
                    <List
                      size='small'
                      bordered={false}
                      dataSource={[
                        { title: '用户名', name: 'SYSTEM_001' },
                        { title: '昵称', name: 'SYSTEM_002' },
                      ]}
                      renderItem={(item: IExpressionVariableOptions) => (
                        <List.Item
                          onClick={() => {
                            handleVariableSelect(item);
                          }}
                        >
                          {item.title}
                        </List.Item>
                      )}
                    />
                  </Panel>
                  <Panel header='页面变量' key='2'>
                    <List
                      size='small'
                      bordered={false}
                      dataSource={[
                        { title: '张三', name: 'PAGE_001' },
                        { title: '李四', name: 'PAGE_002' },
                      ]}
                      renderItem={(item: IExpressionVariableOptions) => (
                        <List.Item>{item.title}</List.Item>
                      )}
                    />
                  </Panel>
                  <Panel header='控件变量' key='3'>
                    <List
                      size='small'
                      bordered={false}
                      dataSource={[
                        { title: '文本框1', name: 'WIDGET_001' },
                        { title: '数字框2', name: 'WIDGET_002' },
                      ]}
                      renderItem={(item: IExpressionVariableOptions) => (
                        <List.Item>{item.title}</List.Item>
                      )}
                    />
                  </Panel>
                  <Panel header='输入参数变量' key='4'>
                    <List
                      size='small'
                      bordered={false}
                      dataSource={[
                        { title: '参数1', name: 'PARAMS_001' },
                        { title: '参数2', name: 'PARAMS_002' },
                      ]}
                      renderItem={(item: IExpressionVariableOptions) => (
                        <List.Item>{item.title}</List.Item>
                      )}
                    />
                  </Panel>
                </Collapse>
              </div>
            </section>
          </Col>
          <Col span={6}>
            <section className='expression-option'>
              <h4>函数</h4>
              <div className='expression-option-body'>
                <Collapse bordered={false}>
                  {EXPRESSION_FUNCTION.map((funType) => (
                    <Panel key={funType.name} header={funType.title}>
                      <List
                        size='small'
                        bordered={false}
                        dataSource={funType.options}
                        renderItem={(item: IExpressionFunctionOptions) => (
                          <List.Item
                            onClick={() => {
                              handleFunctionSelect(item, funType.namespace);
                              setCurFunction(item);
                            }}
                          >
                            {item.title}
                          </List.Item>
                        )}
                      />
                    </Panel>
                  ))}
                </Collapse>
              </div>
            </section>
          </Col>
          <Col span={8}>
            <section className='expression-option'>
              <h4>函数描述</h4>
              <div className='expression-option-body' style={{ padding: 10 }}>
                {curFunction && (
                  <Descriptions column={1}>
                    <Descriptions.Item
                      key='describe'
                      label={SHOW_FUNCTION_FIELD.describe}
                    >
                      {curFunction.describe || '待完善'}
                    </Descriptions.Item>
                    <Descriptions.Item
                      key='usage'
                      label={SHOW_FUNCTION_FIELD.usage}
                    >
                      {curFunction.usage || '待完善'}
                    </Descriptions.Item>
                    <Descriptions.Item
                      key='example'
                      label={SHOW_FUNCTION_FIELD.example}
                    >
                      {curFunction.example || '待完善'}
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </div>
            </section>
          </Col>
        </Row>
        <div className='expression-handle py-4'>
          <span className="expression-handle-tip">请在英文输入法模式下编辑表达式</span>
          <Button type='primary' onClick={()=>{}}>
          确定
          </Button>
        </div>
      </div>
    </Suspense>
  );
};
