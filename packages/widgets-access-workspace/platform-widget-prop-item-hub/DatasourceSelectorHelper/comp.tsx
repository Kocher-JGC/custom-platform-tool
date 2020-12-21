import React, { useState } from "react";
import { Radio } from "antd";
import { PropItemRenderContext } from "@platform-widget-access/spec";
import { PD } from "@provider-app/page-designer/types";
import { DropdownWrapper, Input } from "@infra/ui";

interface OptionsType {
  type: "TABLE" | "DICT";
  tableInfo: {
    id: string;
    name: string;
    condition;
    defaultVal;
    sort;
  };
}

const takeTableInfo = (_tableInfo) => {
  return _tableInfo.name;
};

interface OptionsSelectorProps extends PropItemRenderContext {
  whichAttr: string;
}

export const OptionsSelector: React.FC<OptionsSelectorProps> = (props) => {
  const {
    changeEntityState,
    whichAttr,
    editingWidgetState,
    platformCtx,
  } = props;

  const { changePageMeta, takeMeta, genMetaRefID } = platformCtx.meta;
  // 选项数据源的引用
  const DSOptionsRef = editingWidgetState[whichAttr] as string | undefined;
  const datasourceMeta =
    (DSOptionsRef &&
      (takeMeta({
        metaAttr: "dataSource",
        metaRefID: DSOptionsRef,
      }) as PD.DatasourceInMeta)) ||
    null;

  const dsBinder = (
    <div
      className="__label bg_default t_white cursor-pointer w-full mb10"
      onClick={(e) => {
        platformCtx.selector.openDatasourceSelector({
          defaultSelected: datasourceMeta ? [datasourceMeta] : [],
          modalType: "normal",
          position: "top",
          single: true,
          typeSingle: true,
          typeArea: ["TABLE", "DICT"],
          onSubmit: ({ close, interDatasources }) => {
            // 由于是单选的，所以只需要取 0
            const bindedDS = interDatasources[0];
            const nextMetaID = changePageMeta({
              type: "create&rm",
              metaAttr: "dataSource",
              metaID: DSOptionsRef,
              rmMetaID: DSOptionsRef,
              data: bindedDS,
              // metaID:
            });
            const changeList = [
              {
                attr: whichAttr,
                value: nextMetaID,
              },
            ];
            /** 需要相应清空 值字段，显示字段 */
            const newDsID = bindedDS.id;
            const oldDsID = editingWidgetState[whichAttr];
            if (newDsID !== oldDsID) {
              changeList.push(
                {
                  attr: "realValField",
                  value: "",
                },
                { attr: "showValField", value: "" }
              );
            }
            changeEntityState(changeList);
            close();
          },
        });
      }}
    >
      {datasourceMeta ? takeTableInfo(datasourceMeta) : "点击绑定"}
    </div>
  );

  /**
   * 获取排序字段的展示信息
   * @param dsInMeta
   * @param sortInfo
   */
  const takeSortInfo = (dsInMeta: PD.TableDatasouce[], sortInfo) => {
    const constructDs = () => {
      const result = {};
      dsInMeta?.forEach((ds) => {
        const { name: dsTitle, columns } = ds;
        Object.values(columns || {}).forEach((column) => {
          const { name: columnTitle, id: fieldID, dsID } = column;
          result[`${dsID}.${fieldID}`] = `${dsTitle}.${columnTitle}`;
        });
      });
      return result;
    };
    const titleMap = constructDs();
    return (
      sortInfo
        ?.map((item) => {
          const { dsID, fieldID, sort } = item;
          const title = titleMap[`${dsID}.${fieldID}`];
          const titleSort = { DESC: "降序", ASC: "升序" }[sort];
          return `${title}: ${titleSort}; `;
        })
        .join("") || ""
    );
  };
  /**
   * 排序字段的渲染器
   */
  const renderSortList = () => {
    const { sortInfo } = editingWidgetState;
    if (!datasourceMeta || datasourceMeta.type === "DICT") return null;
    return (
      <div className="mb10">
        <div className="label mb5">排序字段</div>
        <div className="content">
          <span
            className="__label bg_default t_white cursor-pointer w-full"
            onClick={() => {
              platformCtx.selector.openFieldSortHelper({
                defaultValue: sortInfo || [],
                datasource: [datasourceMeta],
                onSubmit: (sortInfoTmpl) => {
                  if (!Array.isArray(sortInfoTmpl) || sortInfoTmpl.length === 0)
                    return;
                  changeEntityState({
                    attr: "sortInfo",
                    value: sortInfoTmpl,
                  });
                },
              });
            }}
          >
            {sortInfo?.length > 0
              ? takeSortInfo([datasourceMeta], sortInfo)
              : "点击配置排序字段"}
          </span>
        </div>
      </div>
    );
  };
  const takeDictField = (dsMeta, fieldCode) => {
    if (!dsMeta) return "";
    const value = editingWidgetState[fieldCode];
    if (!value) return "点击进行字段配置";
    return dsMeta.columns[value]?.name || "";
  };
  /**
   * 值/显示 字段的渲染器
   */
  const renderField = ({ fieldCode, fieldTitle, defaultFieldInDict }) => {
    if (!datasourceMeta) return null;
    return (
      <div className="mb10">
        <div className="label mb5">{fieldTitle}</div>
        <div className="content">
          {datasourceMeta.type === "DICT" ? (
            <span className="__label bg_default t_white w-full">
              {defaultFieldInDict}
            </span>
          ) : (
            <DropdownWrapper
              className=" w-full"
              outside
              overlay={(helper) => {
                return (
                  <div className="column-selector-container">
                    {Object.values(datasourceMeta.columns || {}).map(
                      (col, idx) => {
                        const { name, id } = col;
                        const isSelected = editingWidgetState[fieldCode] === id;
                        return (
                          <div
                            onClick={() => {
                              changeEntityState({
                                attr: fieldCode,
                                value: id,
                              });
                              helper.hide();
                            }}
                            className={`p1-1 list-item ${
                              isSelected ? "disabled" : ""
                            }`}
                            key={id}
                          >
                            {`${name}`}
                          </div>
                        );
                      }
                    ) || null}
                  </div>
                );
              }}
            >
              <span className="__label bg_default t_white cursor-pointer w-full">
                {takeDictField(datasourceMeta, fieldCode)}
              </span>
            </DropdownWrapper>
          )}
        </div>
      </div>
    );
  };
  /**
   * 默认值 的渲染器
   */
  const renderDefaultValue = () => {
    if (!datasourceMeta) return null;
    return (
      <div className="mb10">
        <div className="label mb5">默认值</div>
        <div className="content">
          {datasourceMeta.type === "DICT" ? (
            <span className="__label bg_default t_white w-full">
              {defaultFieldInDict}
            </span>
          ) : (
            <Input
              className="w-full"
              value={editingWidgetState.realValDefault}
              onChange={(value) => {
                changeEntityState({
                  attr: "realValDefault",
                  value,
                });
              }}
            />
          )}
        </div>
      </div>
    );
  };
  return (
    <>
      <div>{dsBinder}</div>
      {renderSortList()}
      {renderField({
        fieldCode: "showValField",
        fieldTitle: "显示字段",
        defaultFieldInDict: "字典项名称",
      })}
      {renderField({
        fieldCode: "realValField",
        fieldTitle: "值字段",
        defaultFieldInDict: "字典项编码",
      })}
    </>
  );
};
