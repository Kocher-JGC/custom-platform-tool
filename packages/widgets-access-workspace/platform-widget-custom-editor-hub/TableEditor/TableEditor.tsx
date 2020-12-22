import React from "react";
import { Button, DropdownWrapper } from "@infra/ui";
import { RegisterEditor } from "@engine/visual-editor/spec";
import { GeneralTableComp } from "@platform-widget/general-table";
import { PlusOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import { PTColumn } from "@platform-widget-access/spec";
import { PD } from "@provider-app/page-designer/types";
import Sortable from "sortablejs";
import { genRenderColumn, genRowData } from "./utils";
import { TextChanger } from "./TextChanger";

import "./index.less";
import { ColumnEditableItems } from "./ColumnEditableItems";

interface TableEditorState {
  datasourceMeta: PD.Datasource;
  usingColumns: PTColumn[];
}

// @CustomEditor({
//   name: 'TableEditor'
// })
export class TableEditor extends React.Component<
  RegisterEditor,
  TableEditorState
> {
  constructor(props) {
    super(props);

    this.state = {
      datasourceMeta: this.takeDS(),
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
          const { oldIndex, newIndex } = evt;
          if (
            typeof oldIndex === "undefined" ||
            typeof newIndex === "undefined"
          )
            return;
          this.setState(({ usingColumns }) => {
            const nextState = [...usingColumns];
            const sortItem = nextState.splice(oldIndex, 1);
            nextState.splice(newIndex, 0, sortItem[0]);
            return {
              usingColumns: nextState,
            };
          });
        },
      });
    }
  };

  setUsingColumns = () => {
    const { entityState } = this.props;
    const { columns = [] } = entityState || {};
    return columns;
  };

  setCol = (item, id) => {
    const { usingColumns } = this.state;
    const itemIdx = usingColumns.findIndex((col) => col.id === id);
    let nextState = [...usingColumns];
    if (itemIdx === -1) {
      nextState.push(item);
    } else {
      nextState.splice(itemIdx, 1);
    }
    nextState = genRenderColumn([...nextState]);
    this.setState({
      usingColumns: nextState,
    });
  };

  renderColumnSelector = () => {
    const { usingColumns, datasourceMeta } = this.state;
    if (!datasourceMeta) return null;
    const { columns } = datasourceMeta;
    return (
      <DropdownWrapper
        outside
        overlay={(helper) => {
          return (
            <div className="column-selector-container">
              {columns.map((col, idx) => {
                const { name, id } = col;
                const isSelected = usingColumns.find((uCol) => uCol.id === id);
                return (
                  <div
                    onClick={(e) => {
                      if (isSelected) return;
                      this.setCol(col, id);
                    }}
                    className={`list-item ${isSelected ? "disabled" : ""}`}
                    key={id}
                  >
                    {name}
                  </div>
                );
              })}
            </div>
          );
        }}
      >
        <PlusOutlined
          style={{
            display: "inline-block",
            fontSize: 16,
          }}
        />
      </DropdownWrapper>
    );
  };

  setUsingColumn = (colIdx, state, replace = false) => {
    this.setState(({ usingColumns }) => {
      const nextUsingColumns = [...usingColumns];
      const mergeState = replace
        ? state
        : Object.assign({}, nextUsingColumns[colIdx], state);
      nextUsingColumns.splice(colIdx, 1, mergeState);
      return {
        usingColumns: nextUsingColumns,
      };
    });
  };

  renderSelectedColumnEditor = () => {
    const { usingColumns, datasourceMeta } = this.state;
    if (!datasourceMeta) return null;
    return (
      <span id="sortable_list_container" className="flex">
        {usingColumns.map((col, idx) => {
          if (!col) return null;
          // console.log(col);
          const { name, id, title, alias, conditionStrategy } = col;
          const displayName = title || name || alias;
          const isActive = usingColumns.find((item) => item && item.id === id);
          return (
            <DropdownWrapper
              key={id}
              className={`column-item idx-${idx} ${isActive ? "active" : ""}`}
              overlay={(helper) => {
                return (
                  <div className="column-setting-helper-container">
                    <TextChanger
                      defaultValue={displayName}
                      onChange={(val) => {
                        // console.log(val);
                        helper.hide();
                        this.setUsingColumn(idx, {
                          title: val,
                        });
                      }}
                    />
                    <ColumnEditableItems
                      defaultValue={conditionStrategy}
                      onChange={(val) => {
                        helper.hide();
                        this.setUsingColumn(idx, {
                          conditionStrategy: val,
                        });
                      }}
                    />
                  </div>
                );
              }}
            >
              <span style={{ color: "inherit" }}>
                <DownOutlined className="selection __action" />
                {displayName}
                <CloseOutlined
                  className="close __action"
                  onClick={(e) => {
                    this.setCol(col, id);
                  }}
                />
              </span>
            </DropdownWrapper>
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
      <div className="column-selector p-4 flex flex-wrap">
        <div className="mr20">
          <span className="title">显示字段</span>
          {this.renderColumnSelector()}
        </div>
        {this.renderSelectedColumnEditor()}
      </div>
    );
  };

  getChangeValue = () => {
    const { entityState } = this.props;
    const { usingColumns } = this.state;
    const targetData = {
      ...entityState,
      search: true,
      columns: usingColumns,
    };
    const resData: { attr: string; value: string }[] = [];
    Object.keys(targetData).forEach((attr) => {
      const value = targetData[attr];
      resData.push({
        attr,
        value,
      });
    });
    // console.log(resData);
    return resData;
  };

  takeDS = () => {
    const { platformCtx, entityState } = this.props;
    const { optDS } = entityState;
    if (!optDS) return null;
    const { takeMeta } = platformCtx.meta;
    const ds = takeMeta({
      metaAttr: "dataSource",
      metaRefID: optDS,
    });
    return ds;
  };

  render() {
    const { onSubmit, changeEntityState } = this.props;
    const { usingColumns } = this.state;
    // console.log(usingColumns);

    const rowData = genRowData(usingColumns);
    // const colRender = genRenderColumn();

    return (
      <div className="table-editor-container">
        <div>
          {this.renderSetColumn()}
          <GeneralTableComp
            rowKey="id"
            // search={false}
            columns={usingColumns}
            dataSource={rowData}
          />
        </div>
        <div className="action-area">
          <Button
            onClick={(e) => {
              const nextState = this.getChangeValue();
              changeEntityState(nextState);
              // this.props.modalOptions?.close();
              onSubmit?.();
            }}
          >
            保存
          </Button>
        </div>
      </div>
    );
  }
}
