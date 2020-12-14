import React from "react";
import { Menu, Dropdown } from "antd";
import { PropItemRenderContext, PTColumn } from "@platform-widget-access/spec";
import { CloseModal, DropdownWrapper, ShowModal } from "@infra/ui";
import { PlusOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import Sortable from "sortablejs";
import { genRenderColumn, isReferenceField } from "./utils";
import { ColumnEditableItems } from "./ColumnEditableItems";
import "./style.scss";

export type DSColumn = {
  type: "dsColumn";
  fieldCode: string;
  tableTitle: string;
  fieldShowType: "realVal" | "showVal";
  colDataType: "string";
};

interface TableDSHelperCompProps extends PropItemRenderContext {
  whichAttr: string;
}

interface TableEditorState {
  datasourceMeta: PD.Datasource[];
  usingColumns: PTColumn[];
}

const takeTableInfo = (_tableInfo) => {
  return _tableInfo.map((item) => item.name).join("，");
};

export class TableDSHelperComp extends React.Component<
  TableDSHelperCompProps,
  TableEditorState
> {
  constructor(props) {
    super(props);

    const datasourceMeta = this.takeDS();

    this.state = {
      datasourceMeta,
      usingColumns: this.setUsingColumns(),
    };
  }

  componentDidMount() {
    this.setupSortableColumnItems();
  }

  setupSortableColumnItems = () => {
    const sortableListContainer = document.querySelector(
      "#sortable_list_container"
    ) as HTMLElement;
    if (sortableListContainer) {
      Sortable.create(sortableListContainer, {
        animation: 150,
        ghostClass: "blue-background-class",
        onSort: (evt) => {
          // console.log(evt);
          const { oldIndex = -1, newIndex = -1 } = evt;
          this.setState(({ usingColumns }) => {
            const nextState = [...usingColumns];
            const sortItem = nextState.splice(oldIndex, 1);
            nextState.splice(newIndex, 0, sortItem[0]);

            this.onSetCol(nextState);

            return {
              usingColumns: nextState,
            };
          });
        },
      });
    }
  };

  takeDS = () => {
    const { platformCtx, editingWidgetState } = this.props;
    const { ds } = editingWidgetState;
    if (!ds) return null;
    const { takeMeta } = platformCtx.meta;
    debugger;
    const dsMeta = takeMeta({
      metaAttr: "dataSource",
      metaRefID: ds,
    });
    return dsMeta;
  };

  ColIndexInUsingColumns = (col) => {
    const { id: fieldID, dsID } = col;
    const { usingColumns } = this.state;
    return usingColumns.findIndex((item) => {
      return (
        item.type === "dsColumn" &&
        item.fieldID === fieldID &&
        item.dsID === dsID
      );
    });
  };

  setCol = (item) => {
    const { usingColumns } = this.state;
    const myIndexInUsingColumns = this.ColIndexInUsingColumns(item);
    const nextState = [...usingColumns];
    if (myIndexInUsingColumns === -1) {
      nextState.push(genRenderColumn(item));
    } else {
      nextState.splice(myIndexInUsingColumns, 1);
    }
    this.setState(
      {
        usingColumns: nextState,
      },
      () => this.setupSortableColumnItems()
    );

    this.onSetCol(nextState);
  };

  onSetCol = (nextState) => {
    const { changeEntityState } = this.props;
    changeEntityState({
      attr: "columns",
      value: nextState,
    });
  };

  setUsingColumns = () => {
    const { editingWidgetState } = this.props;
    const { columns } = editingWidgetState || {};
    return columns || [];
  };

  renderColumnSelector = () => {
    const { datasourceMeta } = this.state;
    if (!datasourceMeta) return null;
    return (
      <DropdownWrapper
        outside
        overlay={(helper) => {
          return (
            <div className="column-selector-container">
              {(Array.isArray(datasourceMeta) &&
                datasourceMeta.map((ds) => {
                  const { columns, name: tableTitle } = ds;
                  return (
                    <div className="list-item">
                      <div className="disabled">{tableTitle}</div>
                      {Object.values(columns || {}).map((col, idx) => {
                        const { name, id } = col;
                        const isSelected =
                          this.ColIndexInUsingColumns(col) > -1;
                        return (
                          <div
                            onClick={() => {
                              if (!isSelected) {
                                this.setCol(col);
                              }
                            }}
                            className={`p1-1 list-item ${
                              isSelected ? "disabled" : ""
                            }`}
                            key={id}
                          >
                            {`${tableTitle}.${name}`}
                          </div>
                        );
                      }) || null}
                    </div>
                  );
                })) ||
                null}
            </div>
          );
        }}
      >
        <span className="title flex items-center">
          <span>显示字段</span>
          <PlusOutlined
            style={{
              display: "inline-block",
              // fontSize: 16
            }}
          />
        </span>
      </DropdownWrapper>
    );
  };

  constructColumnAttr = (column) => {
    const { type } = column;
    if (type === "dsColumn") {
      return this.constructDsColumnAttr(column);
    }
    return {};
  };

  getDataShowType = ({ fieldShowType, colDataType }) => {
    const amIReferenceField = isReferenceField(colDataType);
    return amIReferenceField ? fieldShowType : "realVal";
  };

  getTargetDs = (dsID) => {
    const { datasourceMeta } = this.state;
    return datasourceMeta.find((item) => {
      return item.id === dsID;
    });
  };

  constructDsColumnAttr = (column) => {
    // TODO 数据源会支持带入附属表，需要改动
    const { dsID, fieldID } = column;
    const datasourceMeta = this.getTargetDs(dsID);
    const { fieldCode, colDataType } = datasourceMeta?.columns[fieldID] || {};
    const { fieldShowType } = column;
    const newDataShowType = this.getDataShowType({
      colDataType,
      fieldShowType,
    });
    return Object.assign({}, column, {
      tableTitle: datasourceMeta?.name,
      fieldCode,
      fieldShowType: newDataShowType,
      colDataType,
    });
  };

  updateCol = (item, id) => {
    const { usingColumns } = this.state;
    const itemIdx = usingColumns.findIndex((col) => col.id === id);
    const nextState = [...usingColumns];
    nextState.splice(itemIdx, 1, item);
    this.setState(
      {
        usingColumns: nextState,
      },
      () => this.setupSortableColumnItems()
    );
    this.onSetCol(nextState);
  };

  renderSelectedColumnMenu = (col, id) => {
    return (
      <Menu>
        <Menu.Item
          key="0"
          onClick={(e) => {
            const modalID = ShowModal({
              title: "编辑列",
              type: "side",
              position: "right",
              width: 300,
              children: () => {
                return (
                  <div>
                    <ColumnEditableItems
                      defaultValue={this.constructColumnAttr(col)}
                      onChange={(column) => {
                        this.updateCol(column, col.id);
                        CloseModal(modalID);
                      }}
                    />
                  </div>
                );
              },
            });
          }}
        >
          <span>编辑列</span>
        </Menu.Item>
        <Menu.Item key="1">
          <span>编辑组件</span>
        </Menu.Item>
      </Menu>
    );
  };

  renderSelectedColumnEditor = () => {
    const { usingColumns, datasourceMeta } = this.state;
    if (!datasourceMeta) return null;
    return (
      <span id="sortable_list_container" className="flex">
        {usingColumns.map((col, idx) => {
          if (!col) return null;
          // console.log(col);
          const { id, title } = col;
          // const isActive = usingColumns.find((item) => item && item.id === id);
          return (
            <div
              className={`column-item idx-${idx}`}
              style={{ color: "inherit" }}
              key={id}
            >
              <Dropdown
                overlay={this.renderSelectedColumnMenu(col, id)}
                trigger={["click"]}
              >
                <span className="ant-dropdown-link">
                  <DownOutlined className="mr-2" />
                  {title}
                </span>
              </Dropdown>
              <CloseOutlined
                className="close __action"
                onClick={(e) => {
                  this.setCol({ id: col.fieldID, dsID: col.dsID });
                }}
              />
            </div>
          );
        })}
      </span>
    );
  };

  /**
   * column 的渲染器
   * TODO: 完善更强的 column 的数据结构抽象
   */
  renderSetColumn = () => {
    const { datasourceMeta } = this.state;
    if (!datasourceMeta) return null;
    return (
      <div className="column-selector p-4">
        <div className="mb10">{this.renderColumnSelector()}</div>
        {this.renderSelectedColumnEditor()}
      </div>
    );
  };

  setDatasourceMetaForSelf = (datasourceMeta) => {
    this.setState({
      datasourceMeta,
    });
  };

  render() {
    const {
      changeEntityState,
      whichAttr,
      editingWidgetState,
      platformCtx,
    } = this.props;

    const { changePageMeta } = platformCtx.meta;

    const { datasourceMeta } = this.state;
    // console.log(datasourceMeta);
    // 选项数据源的引用
    const DSOptionsRef = editingWidgetState[whichAttr] as string | undefined;

    const dsBinder = (
      <div
        className="px-4 py-2 border cursor-pointer"
        onClick={() => {
          platformCtx.selector.openDatasourceSelector({
            defaultSelected: Array.isArray(datasourceMeta)
              ? datasourceMeta
              : [],
            modalType: "normal",
            position: "top",
            single: true,
            typeArea: ["TABLE"],
            onSubmit: ({ close, interDatasources }) => {
              if (
                !Array.isArray(interDatasources) ||
                interDatasources.length === 0
              ) {
                return close();
              }

              close();

              if (interDatasources.length === 0) {
                return close();
              }
              const nextMetaID = changePageMeta({
                type: "create/batch&rm/batch",
                metaAttr: "dataSource",
                // metaID: DSOptionsRef,
                rmMetaIDList: DSOptionsRef,
                dataList: interDatasources,
                // metaID:
              });
              changeEntityState({
                attr: whichAttr,
                value: nextMetaID,
              });
              this.setDatasourceMetaForSelf(interDatasources);
            },
          });
        }}
      >
        {datasourceMeta ? takeTableInfo(datasourceMeta) : "点击绑定"}
      </div>
    );

    return (
      <div>
        {dsBinder}
        {this.renderSetColumn()}
      </div>
    );
  }
}
