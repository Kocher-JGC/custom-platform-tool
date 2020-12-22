import React from "react";
import { message } from "antd";
import { CloseModal, ShowModal } from "@infra/ui";
import { PlatformCtx } from "@platform-widget-access/spec";
import { DataSourceSelector } from "../components/PDDataSource";
import { FieldSortHelper } from "../components/PDInfraUI/FieldSortHelper";
import { Expression } from "../components/Expression";

/**
 * 平台提供给的上下文
 */
export const createPlatformCtx = (
  metaCtx: PlatformCtx["meta"]
): PlatformCtx => {
  return {
    ui: {
      showMsg: (ctx) => {
        const { msg, type } = ctx;
        message[type](msg);
      },
    },
    meta: metaCtx,
    selector: {
      openDatasourceSelector: (options) => {
        const {
          defaultSelected,
          modalType,
          position,
          typeArea,
          single,
          onSubmit,
          typeSingle,
        } = options;
        const ModalID = ShowModal({
          title: "数据源选择",
          type: modalType,
          position,
          width: "85%",
          children: ({ close }) => {
            return (
              <DataSourceSelector
                bindedDataSources={defaultSelected}
                typeArea={typeArea}
                single={single}
                typeSingle={typeSingle}
                onSubmit={(selectedDSFromRemote, interDatasources) => {
                  onSubmit({ close, interDatasources, selectedDSFromRemote });
                }}
              />
            );
          },
        });
        return () => {
          CloseModal(ModalID);
        };
      },
      openExpressionImporter: (options) => {
        const { defaultValue, defaultVariableList, onSubmit } = options;
        const modalID = ShowModal({
          title: "表达式编辑",
          width: "85%",
          children: () => {
            return (
              <Expression
                defaultValue={defaultValue}
                defaultVariableList={defaultVariableList}
                metaCtx={metaCtx}
                onSubmit={onSubmit}
              />
            );
          },
        });
        return () => {
          CloseModal(modalID);
        };
      },
      openFieldSortHelper: (options) => {
        const { defaultValue, datasource, onSubmit } = options;
        const ModalID = ShowModal({
          title: "排序字段选择",
          width: "85%",
          children: ({ close }) => {
            return (
              <div className="p-4">
                <FieldSortHelper
                  bindedFields={defaultValue}
                  bindedDs={datasource}
                  onSubmit={(bindedFields) => {
                    onSubmit(bindedFields);
                    CloseModal(ModalID);
                  }}
                  onCancel={() => {
                    CloseModal(ModalID);
                  }}
                />
              </div>
            );
          },
        });
        return () => {
          CloseModal(ModalID);
        };
      },
    },
  };
};

export const PlatformContext = React.createContext<PlatformCtx>();
