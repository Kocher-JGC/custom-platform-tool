import { RunTimeCtxToBusiness } from "../runtime/types/dispatch-types";

export const whenHandle = (ctx: RunTimeCtxToBusiness, when) => {
  const { pageStatus } = ctx;
  return when[0] === pageStatus;
};
