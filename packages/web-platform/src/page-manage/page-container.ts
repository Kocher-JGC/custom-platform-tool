import { RunTimeCtxToBusiness } from "@iub-dsl/engine/runtime/types";
import { initPageCtxManage, PageCtxInfo, AddPageCtx } from "./page-context";

/**
 * @description 页面运行容器职责
 * 1. 管理页面的运行时上下文「IUBDSL/定制」「基础功能」
 * 2. 跨页面上下文调用
 * 3. 跨页面数据通讯
 * 3. 跨页面执行任务
 * 4. 跨页面数据观察
 * 5. 「有关跨页面所有内容」
 * @instance 实现方式
 * 1. 类单例 + 修饰符扩展「有点难」
 * 2. 函数方法的单例 + 混入
 */

type StateType = 'tableRowData' | 'selectData' | 'tableData' | 'schemasData'

// interface CrossPageSendDataSpec {
//   pageState: {
//     [K in StateType]: any;
//   };
//   metadataData: {},
// }

export interface PageManageInstance {
  addPageCtx: AddPageCtx;
  removePageCtx: (pageIdOrMark: string) => PageCtxInfo<any>[]
  getIUBPageCtx: (options: GetIUBPageCtxParam) => RunTimeCtxToBusiness[]
}

interface GetIUBPageCtxParam {
  pageIdOrMark: string, // 页面ID或页面mark
  isMatch?: boolean, // 是否模糊匹配
  isShelf?: boolean, // 是否只自身广播
}

let pageManageInstance: PageManageInstance;

export const pageManage = (): PageManageInstance => {
  if (pageManageInstance) return pageManageInstance;
  const { addPageCtx, removePageCtx, getPageCtx: gPC } = initPageCtxManage();

  /** 获取IUB页面的上下文 */
  const getIUBPageCtx = ({ pageIdOrMark, isMatch = true, isShelf = false, }) => {
    const pageCtx = gPC(pageIdOrMark);

    /** 获取useRef的上下文并且过滤无效的 */
    return pageCtx.map((c) => c.context?.current).filter((v) => v);
  };

  const instance = {
    addPageCtx, removePageCtx, getIUBPageCtx
  };

  return (pageManageInstance = instance);
};
