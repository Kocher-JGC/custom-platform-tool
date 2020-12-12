import React, { ReactElement } from "react";
import { Input, Selector } from "@infra/ui";
import {
  ChangeEntityState,
  PropItemRenderContext,
} from "@platform-widget-access/spec";

/**
 * 可用的值的类型
 */
const selectTypes = {
  costomValue: "自定义",
  expression: "表达式",
  variable: "变量",
};

/**
 * ValueHelperProps
 */
interface ValueHelperProps extends PropItemRenderContext {
  editingWidgetState;
  onChange: ChangeEntityState;
}

/**
 * ValueHelper
 * @param param0
 */
export const ValueHelper: React.FC<ValueHelperProps> = ({
  editingWidgetState,
  platformCtx,
  onChange,
}) => {
  const { exp, realVal, variable } = editingWidgetState;
  const defaultSelectedItem = (() => {
    if (exp) return "expression";
    if (variable) return "variable";
    return "costomValue";
  })();
  const [selectedItem, setSelectedItem] = React.useState(defaultSelectedItem);
  let Comp: ReactElement | null | undefined;

  if (selectedItem === "costomValue") {
    Comp = (
      <Input
        value={realVal || ""}
        onChange={(value) =>
          onChange([
            { value, attr: "realVal" },
            /** 需要将 value 清空 */
            { value: null, attr: "exp" },
            { value: null, attr: "variable" },
          ])
        }
      />
    );
  } else if (selectedItem === "expression") {
    Comp = (
      <div
        className="px-4 py-2 border"
        onClick={() => {
          const closeModal = platformCtx.selector.openExpressionImporter({
            defaultValue: exp,
            onSubmit: (newExp) => {
              onChange([
                {
                  value: newExp.code && newExp.variable ? newExp : "",
                  attr: "exp",
                },
                /** 需要将 value 清空 */
                { value: null, attr: "realVal" },
                { value: null, attr: "variable" },
              ]);
              closeModal();
            },
          });
        }}
      >
        {exp ? "已设置表达式" : "点击设置表达式"}
      </div>
    );
  } else if (selectedItem === "variable") {
    Comp = <div>待开发</div>;
  }

  return (
    <div className="value-helper flex">
      <div className="mb-2">
        <Selector
          needCancel={false}
          value={selectedItem}
          values={selectTypes}
          onChange={(val) => setSelectedItem(val)}
        />
      </div>
      <div>{Comp}</div>
    </div>
  );
};
