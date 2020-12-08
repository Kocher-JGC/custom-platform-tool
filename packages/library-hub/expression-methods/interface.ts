export interface IExpressionFunctionOptions {
  title: string;
  name: string;
  describe: string;
  usage: string;
  example: string;
  async?: boolean;
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  execute: Function;
  describe?: string;
  usage?: string;
  example?: string;
}
