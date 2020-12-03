import React, { useRef, useState } from 'react';
import { Button, Row, Col, Collapse, List, Descriptions } from 'antd';
import { ExpressionEditor } from './ExpressionEditor';
import { EXPRESSION_FUNCTION, SHOW_FUNCTION_FIELD } from './constants';
import {
  IExpressionFunctionOptions,
  IExpressionVariableOptions,
} from './interface';
import './expression.less';

const { Panel } = Collapse;

export const Expression: React.FC<{
  defaultValue: string;
  onSubmit: (val: string) => void;
}> = ({ defaultValue, onSubmit }) => {
  const editorRef = useRef<{ addFunction: (functionItem: IExpressionFunctionOptions) => void; addVariable: (variableItem: IExpressionVariableOptions) => void; generateExpression: () => void; }>(null);
  const [
    curFunction,
    setCurFunction,
  ] = useState<IExpressionFunctionOptions | null>(null);

  const handleFunctionSelect = (functionItem: IExpressionFunctionOptions) => {
    editorRef?.current?.addFunction(functionItem);
  };

  const handleVariableSelect = (variableItem: IExpressionVariableOptions) => {
    editorRef?.current?.addVariable(variableItem);
  };

  const submitExpression = () => {
    const code = editorRef?.current?.generateExpression();
    return code;
  };

  return (
    <div className='expression'>
      <div className='expression-header'>结果 =</div>
      <ExpressionEditor defaultValue={defaultValue} ref={editorRef} />
      <Row gutter={10}>
        <Col span={8}>
          <section className='expression-option'>
            <h4>可用变量</h4>
            <div className='expression-option-body'>
              <Collapse defaultActiveKey={['1']} bordered={false}>
                <Panel header='系统变量' key='1'>
                  <List
                    size='small'
                    bordered={false}
                    dataSource={[
                      { label: '用户名', value: 'SYSTEM_001' },
                      { label: '昵称', value: 'SYSTEM_002' },
                    ]}
                    renderItem={(item: IExpressionVariableOptions) => (
                      <List.Item
                        onClick={() => {
                          handleVariableSelect(item);
                        }}
                      >
                        {item.label}
                      </List.Item>
                    )}
                  />
                </Panel>
                <Panel header='页面变量' key='2'>
                  <List
                    size='small'
                    bordered={false}
                    dataSource={[
                      { label: '张三', value: 'PAGE_001' },
                      { label: '李四', value: 'PAGE_002' },
                    ]}
                    renderItem={(item: IExpressionVariableOptions) => (
                      <List.Item>{item.label}</List.Item>
                    )}
                  />
                </Panel>
                <Panel header='控件变量' key='3'>
                  <List
                    size='small'
                    bordered={false}
                    dataSource={[
                      { label: '文本框1', value: 'WIDGET_001' },
                      { label: '数字框2', value: 'WIDGET_002' },
                    ]}
                    renderItem={(item: IExpressionVariableOptions) => (
                      <List.Item>{item.label}</List.Item>
                    )}
                  />
                </Panel>
                <Panel header='输入参数变量' key='4'>
                  <List
                    size='small'
                    bordered={false}
                    dataSource={[
                      { label: '参数1', value: 'PARAMS_001' },
                      { label: '参数2', value: 'PARAMS_002' },
                    ]}
                    renderItem={(item: IExpressionVariableOptions) => (
                      <List.Item>{item.label}</List.Item>
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
                            handleFunctionSelect(item);
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
        <Col span={10}>
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
        <Button type='primary' onClick={submitExpression}>
          确定
        </Button>
      </div>
    </div>
  );
};
