import { InterCollection } from '@iub-dsl/definition';

/**
 * 可以通过不同的type注册装载不同的转换器
 * inter是标准结构
 */
export const interParser = (InterC: InterCollection) => {

  const interCKeys  = Object.keys(InterC);

  interCKeys.forEach((key) => {
    // console.log(InterC[key]);
    
  });
  
};

const fn = (ctx, runCtx) => {
  const list: any[] = [];
  const { 
    type, APBDSLItemTrans,
    reqFn, APBDSLMerge, getReqInter,
    getSetMap, getCond, getPageInfo, 
    getSort, getGroup, getFields  
  } = ctx;
  const tr = list.map(v => {
    if (type === 'set') {
      return APBDSLItemTrans({
        inter: getReqInter(runCtx),
        set: getSetMap(runCtx),
      });
    } else if (type === 'upd') {
      return APBDSLItemTrans({
        inter: getReqInter(runCtx),
        set: getSetMap(runCtx),
        condition: getCond(runCtx),
      });
    } else if (type === 'sel') {
      return APBDSLItemTrans({
        inter: getReqInter(runCtx),
        condition: getCond(runCtx),
        ...getPageInfo(runCtx),
        // getSort(), getGroup(), getFields()  
      });
    } else {
      return APBDSLItemTrans({
        inter: getReqInter(runCtx),
        condition: getCond(runCtx),
      });
    }
  });
  const APBDSL = APBDSLMerge(tr);
  return reqFn({ APBDSL });
};


/**
 * 模块职能
 * IUBDSL的扩展, 提供给IUBDSL内部发请求的模块
 * 1. APBDSL请求
 * 2. 三方请求
 * 
 * 1. 请求函数 [返回处理、 错误处理 ] (一种类型一个请求函数)
 * 2. APBDSL转换器「分片转换」{每个获取都是单独的, 但是合并是要处理关系的}
 * 3. IBDSL 依赖 「数据获取函数、条件处理引擎」
 * 4. 分页处理模块、 排序、分组
// R -> page\total\fields\sort\group --> 引用关系
 */

/**
 * 1. 页面加载获取下拉框数据
 * 2. 查询, 需要连表, 将实际值转为实际值
 * 3. 点击详情, 传入ID, 拼接3个查询+连表 「但不会查询下拉框数据」
 * 4. 点击修改, 区别详情, 需要查询, 下拉框数据
 */
/**
 * 点击出库, 传入资产编码, 拼接连表查询, 回填基本信息, 查询下拉框数据
 * 表达式计算 库存数量 - 出库数量 = 剩余数量「隐含的自定义变量」
 * 修改: 修改的页面状态是页面变量
 * 
 */

/**
 * 接口引用关系的描述 「确保数据的准确性和完整性」
 * 1. 新增/修改 是新增/修改引用关系
 *   1). 新增， 附属表需要把外键引用关系建立 「(*^__^*)」
 *   2). id， 引用因为存储的实际值就是id的引用
 * 2. 查询 「需要查什么内容， 确保内容的准确和完整性」
 *   1). 确保准确性： 进行连表拼接的、1+1的额外操作 「(*^__^*)」
 *   2). 通过标示进行读写数据， 可以弱化引用关系 「(*^__^*)」
 * 3. 删除
 *   1). 需要把相关的引用或信息都干掉「后端完成」
 */

/** APB的组合功能? */
// 1. 引用功能组合 「连表查询」
// 2. 引用关联删除
// 3. 有引用关系的新增

// C -> dataCollect
// U -> dataCollect + condition
// D -> condition
// R -> page\total\fields\sort\group --> 引用关系

/** 
 * 引用关系的抽象
 * A.id ref B.fid
 * A.id ref B.pid
 */

/**
 * 一对一、一对多、多对一、多对多
 */