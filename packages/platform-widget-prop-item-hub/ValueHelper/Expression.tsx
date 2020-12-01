import React, { useRef, useState } from 'react';
import { Button, Row, Col, Collapse, List, Descriptions } from 'antd';
import { ExpressionEditor } from './ExpressionEditor';
import { EXPRESSION_FUNCTION, SHOW_FUNCTION_FIELD } from './constants';
import { IExpressionFunctionOptions } from './interface';
import './expression.less';

const { Panel } = Collapse;

export const Expression = ({
  defaultValue,
  onSubmit
}) => {
  const editorRef = useRef();
  const [curFunction, setCurFunction] = useState<IExpressionFunctionOptions | null>(null);

  const handleFunctionSelect = (fun) => {
    editorRef?.current?.addFunction(fun);
  };

  const handleVariableSelect = (fun) => {
    editorRef?.current?.addVariable(fun);
  };


  return (
    <div className="expression">
      <div className="expression-header">结果 =</div>
      <ExpressionEditor defaultValue={defaultValue} ref={editorRef} />

      <Row gutter={10}>
        <Col span={8}>
          <section className="expression-option">
            <h4>可用变量</h4>
            <div className="expression-option-body">
              <Collapse defaultActiveKey={['1']} bordered={false}>
                <Panel header="系统变量" key="1">
                  <List
                    size="small"
                    bordered={false}
                    dataSource={[{ label: "张三", value: "101" }, { label: "李四", value: "102" }]}
                    renderItem={item => (
                      <List.Item onClick={() => {
                        handleVariableSelect(item);
                      }}
                      >
                        {item.label}
                      </List.Item>
                    )}
                  />
                </Panel>
                <Panel header="页面变量" key="2">
                  <List
                    size="small"
                    bordered={false}
                    dataSource={[{ label: "李四", value: "201" }, { label: "张三", value: "202" }]}
                    renderItem={item => (
                      <List.Item>
                        {item.label}
                      </List.Item>
                    )}
                  />
                </Panel>
                <Panel header="控件变量" key="3">
                  <List
                    size="small"
                    bordered={false}
                    dataSource={[{ label: "文本框", value: "301" }, { label: "张三", value: "302" }]}
                    renderItem={item => (
                      <List.Item>
                        {item.label}
                      </List.Item>
                    )}
                  />
                </Panel>
                <Panel header="输入参数变量" key="4">
                  <List
                    size="small"
                    bordered={false}
                    dataSource={[{ label: "页面 ID", value: "401" }, { label: "张三", value: "402" }]}
                    renderItem={item => (
                      <List.Item>
                        {item.label}
                      </List.Item>
                    )}
                  />
                </Panel>
              </Collapse>
            </div>
          </section>
        </Col>
        <Col span={6}>
          <section className="expression-option">
            <h4>函数</h4>
            <div className="expression-option-body">
              <Collapse bordered={false}>
                {
                  EXPRESSION_FUNCTION.map((funType)=><Panel key={funType.name} header="字符串函数">
                    <List
                      size="small"
                      bordered={false}
                      dataSource={funType.options}
                      renderItem={item => (
                        <List.Item onClick={()=>{
                          handleFunctionSelect(item);
                          setCurFunction(item);
                        }}
                        >
                          {item.title}
                        </List.Item>
                      )}
                    />
                  </Panel>)
                }
              </Collapse>
            </div>
          </section>
        </Col>
        <Col span={10}>
          <section className="expression-option">
            <h4>函数描述</h4>
            <div className="expression-option-body" style={{ padding:10 }}>
              {
                curFunction && <Descriptions column={1}>
                  {
                    Object.keys(curFunction).filter((fun) => SHOW_FUNCTION_FIELD[fun] || SHOW_FUNCTION_FIELD[fun] === "").map((key)=> <Descriptions.Item key={key} label={SHOW_FUNCTION_FIELD[key]}>{curFunction[key] || "待完善"}</Descriptions.Item>)
                  }
                </Descriptions>
              }
            </div>
          </section>
        </Col>
      </Row>

      <div className="expression-handle px-4 py-2">
        <Button
          type="primary"
          onClick={(e) => {
            // onSubmit?.(editingVal);
          }}
        >
          确定
        </Button>
      </div>
    </div>
  );
};