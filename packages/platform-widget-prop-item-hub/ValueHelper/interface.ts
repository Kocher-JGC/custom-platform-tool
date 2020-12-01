export interface IExpressionVariableOptions {
  label: string;
  value: string;
}

export interface IExpressionFunctionOptions {
  title: string;
  name: string;
  describe: string;
  usage: string;
  example: string;
}

export interface IExpressionFunction {
  title: string;
  name: string;
  options: IExpressionFunctionOptions[];
}
