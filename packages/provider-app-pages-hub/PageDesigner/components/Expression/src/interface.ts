export interface IHyMethod {
  type: "STRING" | "DATE" | "ASYNC" | "MATH";
  namespace: "HY";
  name: string;
  execute: () => unknown;
  describe?: string;
  usage?: string;
  example?: string;
}
