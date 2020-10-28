/**
 * @description 转换含有特殊标示的字符串
 */

import { isPageState } from "../../state-manage";
import { isPageDatasoruceMeta } from "../../datasource-meta";
import {
  DispatchMethodNameOfIUBStore, DispatchMethodNameOfDatasourceMeta,
  RunTimeCtxToBusiness, DispatchModuleName,
} from "../types";
import { } from "../types/dispatch-types";

/**
 * 将含有特殊标示的值进行转换转换值
 * @example @(schemas).dId1 将获取页面数据中dId1的值
 * @param value 需要被转换的值
 * @param ctx 上下文
 */
const transformMarkValue = (ctx: RunTimeCtxToBusiness, value: string) => {
  const { dispatchOfIUBEngine } = ctx;
  if (isPageState(value)) {
    return dispatchOfIUBEngine({
      dispatch: {
        module: DispatchModuleName.IUBStore,
        method: DispatchMethodNameOfIUBStore.getPageState,
        params: [value]
      }
    });
  }
  if (isPageDatasoruceMeta(value)) {
    return dispatchOfIUBEngine({
      dispatch: {
        module: DispatchModuleName.datasourceMeta,
        method: DispatchMethodNameOfDatasourceMeta.getFiledCode,
        params: [value]
      }
    });
  }
  return value;
};

/**
 * @method transformMarkValuesFormArray 将特殊标示的值的数组进行转换
 * @name transMarkValFromArr 方法名缩写
 * @param values 需要被转换的值数组
 * @param ctx 上下文
 */
export const transMarkValFromArr = (ctx: RunTimeCtxToBusiness, values: string[]) => {
  return values.map((v) => transformMarkValue(ctx, v));
};

/**
 * @description 背景, 后端说传空字符串也生效是没问题的, 所以需要过滤
 * @method validTransformMarkValueFromArray 验证值数组是否为空
 * @name validTransMarkValFromArr 方法名缩写
 * @param values 需要被验证的值的数组
 */
export const validTransMarkValFromArr = (values: string[]) => {
  const isVaild = values.every((v) => v);
  return isVaild ? values : false;
};
