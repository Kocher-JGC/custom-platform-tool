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
