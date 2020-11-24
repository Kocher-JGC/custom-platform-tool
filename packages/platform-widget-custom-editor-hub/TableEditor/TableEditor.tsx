import React from 'react';
import { Button, Input } from '@infra/ui';
import { RegisterEditor } from '@engine/visual-editor/spec';
import { GeneralTableComp } from '@platform-widget/general-table';
import { data } from './mock-data';
import { CustomEditor } from '@platform-widget-access/spec';


interface TableEditorState {
  datasourceMeta: PD.Datasource
  usingColumns: PD.Column[]
}

// @CustomEditor({
//   name: 'TableEditor'
// })
export class TableEditor extends React.Component<RegisterEditor, TableEditorState> {
  constructor(props) {
    super(props);

    this.state = {
      datasourceMeta: this.takeDS(),
      usingColumns: this.setUsingColumns()
    };
  }

  setUsingColumns = () => {
    const { entityState } = this.props;
    const { columns = [] } = entityState || {};
    return columns;
  }

  useCol = (item, id) => {
    const { usingColumns } = this.state;
    const itemIdx = usingColumns.findIndex((col) => col.id === id);
    const nextState = [...usingColumns];
    if (itemIdx === -1) {
      nextState.push(item);
    } else {
      nextState.splice(itemIdx, 1);
    }
    this.setState({
      usingColumns: nextState
    });
  }

  renderSetColumn = () => {
    const { usingColumns, datasourceMeta } = this.state;
    const { columns, name, id } = datasourceMeta;
    return (
      <div className="column-selector p-4 flex flex-wrap">
        <span>选择列：</span>
        {
          columns.map((col, idx) => {
          // console.log(col);
            const { name, id } = col;
            const isActive = usingColumns.find((item) => item.id === id);
            return (
              <span
                className={`pointer mb5 shadow-sm bg-gray-200 rounded mr10 px-4 py-2 ${isActive ? 't_blue' : ''}`}
                key={id}
                onClick={(e) => this.useCol(col, id)}
              >
                {name}
              </span>
            );
          })
        }
      </div>
    );
  }

  getChangeValue = (currColumns) => {
    const { entityState } = this.props;
    return {
      ...entityState,
      columns: currColumns
    };
  }

  /**
   * 模拟生成 row 数据
   */
  genRowData = () => {
    const { usingColumns } = this.state;
    const rowCount = 3;
    const resData = [];
    [...Array(rowCount)].forEach((_, _idx) => {
      const rowItem = {};
      usingColumns.forEach((col, idx) => {
        // const { id, name, fieldCode } = col;
        for (const colKey in col) {
          if (Object.prototype.hasOwnProperty.call(col, colKey)) {
            rowItem[colKey] = '';
          }
        }
        rowItem.id = _idx;
      });
      resData.push(rowItem);
    });
    return resData;
  }

  /**
   * 模拟生成 row 数据
   */
  genRenderColumn = () => {
    const { usingColumns } = this.state;
    const resData = [];
    const colItem = {};
    usingColumns.forEach((col, idx) => {
      const { id, name, fieldCode } = col;
      colItem[fieldCode] = '';
      resData.push({
        title: name,
        dataIndex: fieldCode,
      });
    });
    return resData;
  }

  takeDS = () => {
    const { platformCtx, entityState } = this.props;
    const { optDS } = entityState;
    if(!optDS) return null;
    const { takeMeta } = platformCtx.meta;
    const ds = takeMeta({
      metaAttr: 'dataSource',
      metaRefID: optDS
    });
    return ds;
  }

  render() {
    const {
      changeEntityState, onSubmit
    } = this.props;

    const rowData = this.genRowData();
    const colRender = this.genRenderColumn();
    
    const { usingColumns } = this.state;
    return (
      <div className="px-4 py-2">
        {this.renderSetColumn()}
        {/* <div className="p10">
          <Button>变量</Button>
        </div> */}
        <GeneralTableComp columns={colRender} rowKey="id" dataSource={rowData} />
        <div className="action-area p10">
          <Button
            onClick={(e) => {
              changeEntityState(this.getChangeValue(usingColumns));
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
