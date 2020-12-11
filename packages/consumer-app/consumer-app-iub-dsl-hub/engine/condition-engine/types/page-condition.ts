import { normalCondParam } from "./utils";

export interface NormalParserFn {
  (param: normalCondParam): boolean;
}
