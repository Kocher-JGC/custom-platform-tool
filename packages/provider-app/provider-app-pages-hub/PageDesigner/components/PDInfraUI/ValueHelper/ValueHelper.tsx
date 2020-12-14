import React, { useEffect, useState } from "react";
import { Input, Select, TreeSelector } from "@infra/ui";
import { PropItemRenderContext } from "@platform-widget-access/spec";
import { VariableItem } from "@provider-app/page-designer/platform-access";
import "./style.scss";
/**
 * 可用的值的类型
 */
const SELECT_TYPE_MENU = [
  { label: "自定义", value: "realVal", key: "realVal" },
  { label: "表达式", value: "exp", key: "exp" },
  { label: "变量", value: "variable", key: "variable" },
];
/**
 * ValueHelperProps
 */
interface ValueHelperProps {
  platformCtx: PropItemRenderContext["platformCtx"];
  editedState;
  onChange;
  variableData: { [key: string]: VariableItem[] };
}

// interface VariableItemInState {
//   title: string;
//   value: string;
//   disabled?: boolean;
// }

// interface VariableListInState extends VariableItemInState {
//   children?: VariableItemInState[];
// }
/**
 * ValueHelper
 * @param param0
 */
export const ValueHelper: React.FC<ValueHelperProps> = ({
  platformCtx,
  variableData,
  editedState,
  onChange,
}) => {
  const [selectedItem, setSelectedItem] = useState("realVal");
  const { exp, realVal, variable } = editedState;

  const initVariableList = () => {
    const constructVarList = (list: VariableItem[]) => {
      return Array.isArray(list)
        ? list.map((item) => constructVarItem(item))
        : [];
    };
    const constructVarItem = (item: VariableItem) => {
      const { id, title } = item;
      return { value: id, title };
    };
    return [
      {
        title: "自定义变量",
        value: "customed",
        variableList: variableData.customed,
        disabled: true,
      },
      {
        title: "页面变量",
        value: "page",
        variableList: variableData.page,
        disabled: true,
      },
      {
        title: "系统变量",
        value: "system",
        variableList: variableData.system,
        disabled: true,
      },
      {
        title: "控件变量",
        value: "widget",
        variableList: variableData.widget,
        disabled: true,
      },
      {
        title: "输入参数变量",
        value: "pageInput",
        variableList: variableData.pageInput,
        disabled: true,
      },
    ]
      .filter((item) => item.variableList?.length > 0)
      .map((item) => {
        const { variableList, ...rest } = item;
        return { ...rest, children: constructVarList(variableList) };
      });
  };

  const returnComp = () => {
    if (selectedItem === "realVal") {
      return (
        <Input
          className="custom-value"
          value={realVal || ""}
          onChange={(value) =>
            onChange({
              exp: null,
              realVal: value,
              variable: null,
            })
          }
        />
      );
    }
    if (selectedItem === "exp") {
      return (
        <div
          className="custom-value px-4 py-2 border"
          style={{ display: "inline-block", height: 34 }}
          onClick={() => {
            const closeModal = platformCtx.selector.openExpressionImporter({
              defaultValue: exp,
              onSubmit: (newExp) => {
                onChange({
                  exp: newExp.code ? newExp : null,
                  realVal: null,
                  variable: null,
                });
                // onChange([
                //   {
                //     value: newExp.code && newExp.variable ? newExp : "",
                //     attr: "exp",
                //   },
                //   /** 需要将 value 清空 */
                //   { value: null, attr: "realVal" },
                //   { value: null, attr: "variable" },
                // ]);
                closeModal();
              },
            });
          }}
        >
          {exp ? "已设置表达式" : "点击设置表达式"}
        </div>
      );
    }
    if (selectedItem === "variable") {
      return (
        <TreeSelector
          value={variable || ""}
          className="variable-selector py-1 cursor-pointer"
          showSearch
          onSearch={(value) => {}}
          onChange={(value) =>
            onChange({
              exp: null,
              realVal: null,
              variable: value,
            })
          }
          treeDefaultExpandAll
          treeData={initVariableList()}
        />
      );
    }
    return null;
  };

  useEffect(() => {
    // const selectedKey = 'customValue';
    const keyMenu = SELECT_TYPE_MENU.map((item) => item.value);
    for (let i = 0, keys = Object.keys(editedState); i < keys.length; i++) {
      const key = keys[i];
      if (editedState[key] && keyMenu.includes(key)) {
        setSelectedItem(key);
      }
    }
  }, []);
  return (
    <div className="value-helper">
      <span>{returnComp()}</span>
      <span className="value-type-selector">
        <Select
          options={SELECT_TYPE_MENU}
          onChange={(val) => setSelectedItem(val)}
          value={selectedItem}
        />
      </span>
    </div>
  );
};
