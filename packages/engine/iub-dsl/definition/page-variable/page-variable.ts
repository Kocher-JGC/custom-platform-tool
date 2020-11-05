/**
 * 页面变量
 * 输入变量和自定义变量直接的关系存疑「输入变量的边界」
 * 系统变量
 * 页面名称，页面编码、页面模式、聚焦控件
 * 页面模式有新增、修改、详情、补录「存疑」和空状态。
 * 自定义变量
 * widget变量: 编码、值, 复合值
 * 表格: 表元数据、行、列、选中/正在操作(行、单元格、PK、index)、、总行数、配置「事件动作配置」、 获取正在输入的表格的文本框的 「datametadata+value」
 * 表格: 自定义选择哪几列的数据作为变量
 * 说明: 列出选中行的表格显示字段，如在人员信息表中，选中某一行数据时， 选中行姓名 、 选中行性别 、 选中行性别名称 、 选中行所属机构支持作为变量。
 * 选中元数据: [姓名：“张三”，年龄：“18”，性别：”男“] . 选中行数据: [张三，18，男] ?? 有问题
 *
 * 链接事件编码和链接事件名称为表格行数据设置链接事件时需要提供的值。比如通过表格中单元格的值，链接打开明细列表。???
 * 对于字典、外键、引用表的字段需要提供实际值和显示值。 如果表格支持多选，则选中行的列变量需要为数组，支持获取到选中行中某个列的多个数据。
 *
 * 树形表:
 * 选中/正在操/层级信息「树特有」
 * 节点信息: 「id,name,value,path、元数据等」
 */

/**
 * 有什么可以传 ? 「页面变量」
 * 1. 页面运行时状态.  并且有一套提取规则
 * 2. (提取规则的扩展)当前操作的 [有作用域限制的].表行/树行点击   延伸: 本IUBDSL页面最后操作的控件的状态
 * 3. 其他需求规则
 * 映射规则 ? 「共存,多个」
 * 1. 根据元数据信息映射(多行同理) 「多次使用存疑?」
 * 2. 根据配置信息映射
 */

/**
 * 基础的页面变量数据
 */
interface BasePageVaribale {
  varType: string;
  metaDataRef: string[]; // 如果是嵌套表格可能会有多个
}

interface BasePageVaribaleWithWidget extends BasePageVaribale {
  widgetId: string;
  compMark: string;
}

/**
  * 可以直接在页面变量获取的变量
  */
export interface PageVariableOfConf extends BasePageVaribale {
  varType: 'Mapping'; // 变量类型
  valueType: 'structArray' | 'structObject'; // 传值的类型
  /** 值传递 「与:  数据收集关系差不多」 */
  valueMapping: { // 「仅能配置人员配置产生」
    from: string; // 固定值, 表达式, 页面变量{@(schemas).dId1[#($index)].sdId2}
    to: string; // @(pageVar).dId1
  }[]
  // valueMapping2?: {
  //   '@(schemas).dId1[#($index)].sdId2': '@(refValue).id1'
  // }
}

/** 有规则的页面变量 「符合规则就有」 */
export interface PageVariableOfTable<T = any, G = string> extends BasePageVaribaleWithWidget {
  /** 特定事件操作具有的, 都是实实际际的值 */
  varType: 'TableRow' | 'TableCol' | 'TableGrid'; /** 行/列/单元格 */
  valueInfo: {
    /** 当前格子记录 */
    gridData: G;
    PK: string;
    /** 行记录 */
    rowData: T;
    /** 列记录 */
    colData?: any;
    colKey: number;
    rowKey?: string | number;
    /** 主键Key */
    dataSoruce?: T[];
  }
}

export interface PageVariableOfSelect extends BasePageVaribaleWithWidget {
  /** 特定事件操作具有的, 都是实实际际的值 */
  varType: 'Select';
  valueInfo: {
    selectKeys: string[];
    selectData: any[];
  }
}

export type PageVariable = PageVariableOfConf | PageVariableOfTable | PageVariableOfSelect;
