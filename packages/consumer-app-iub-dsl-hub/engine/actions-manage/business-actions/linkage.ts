import { Linkage } from "@iub-dsl/definition";
import { RunTimeCtxToBusiness } from "../../runtime/types";
import { ActionDoFn } from "../types";

export const LinkageAction = (conf: Linkage, baseActionInfo): ActionDoFn => {
  return async (ctx: RunTimeCtxToBusiness) => {};
};