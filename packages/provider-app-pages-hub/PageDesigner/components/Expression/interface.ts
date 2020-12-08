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
