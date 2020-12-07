import { EventDataNode, DataNode } from 'antd/lib/tree';

interface IExpandNode {
  name?: string;
  description?: string;
}
export interface ITreeNodeInfo {
  event: 'select';
  selected: boolean;
  node: EventDataNode & IExpandNode;
  selectedNodes: DataNode[];
  nativeEvent: MouseEvent;
}

export interface IFuncTree {
  key: string;
  title: string;
  name?: string;
  description?: string;
  children?: IFuncTree[];
}


export interface IBaseOption {
  key: string;
  value: string;
}

export interface IParams {
  key?: string;
  name?: string;
  value?: string | [] | object | number;
  type?: string;
  index?: number;
}
export interface IVariableProps {
  key: string;
  title: string;
  value: any;
  type?: string;
}
export interface IVariableData {
  title: string;
  key: string;
  props: IVariableProps[];
}

export interface IExpressionVariableOptions {
  title: string;
  name: string;
}

export interface IExpressionFunctionOptions {
  title: string;
  name: string;
  describe: string;
  usage: string;
  example: string;
  async?: boolean;
}

export interface IExpressionGrammarOptions {
  title: string;
  name: string;
}

export interface IExpressionFunction {
  title: string;
  name: string;
  options: IExpressionFunctionOptions[];
  namespace: string;
}

export interface IHyMethod {
  type: "STRING" | "DATE" | "ASYNC" | "MATH";
  namespace: "HY";
  name: string;
  execute: Function;
  describe?: string;
  usage?: string;
  example?: string;
}
