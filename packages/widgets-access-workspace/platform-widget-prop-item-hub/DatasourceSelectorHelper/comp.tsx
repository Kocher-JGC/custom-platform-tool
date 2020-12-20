import React, { useState } from "react";
import { Radio } from "antd";
import { PropItemRenderContext } from "@platform-widget-access/spec";
import { PD } from "@provider-app/page-designer/types";

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
      className="px-4 py-2 border cursor-pointer"
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
            changeEntityState({
              attr: whichAttr,
              value: nextMetaID,
            });
            // console.log(submitData);

            close();
          },
        });
      }}
    >
      {datasourceMeta ? takeTableInfo(datasourceMeta) : "点击绑定"}
    </div>
  );

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

  return (
    <>
      <div>{dsBinder}</div>
      {renderSortList()}
    </>
  );
};
