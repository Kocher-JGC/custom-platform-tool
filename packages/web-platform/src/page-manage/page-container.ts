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
  getIUBPageCtx: (pageIdOrMark: string) => any[]
}

let pageManageInstance: PageManageInstance;

export const pageManage = () => {
  if (pageManageInstance) return pageManageInstance;
  const { addPageCtx, removePageCtx, getPageCtx: gPC } = initPageCtxManage();

  /** 获取IUB页面的上下文 */
  const getIUBPageCtx = (pageIdOrMark: string) => {
    const pageCtx = gPC(pageIdOrMark);
    /** 获取useRef的上下文并且过滤无效的 */
    return pageCtx.map((c) => c.context?.current).filter((v) => v);
  };

  /** 页面广播: TODO: 自身的观察者 */
  const pageBroadcast = async ({
    pageIdOrMark, //
    isMatch, // 是否模糊匹配
    isShelf, // 是否只自身广播
    receiveHandle, // 接收处理函数
  }) => {
    const pageCtx = gPC(pageIdOrMark);
    if (pageCtx[0]) {
      await receiveHandle(pageCtx[0]);
    }
  };

  const instance = {
    addPageCtx, removePageCtx, getIUBPageCtx, pageBroadcast
  };

  return (pageManageInstance = instance);
};
