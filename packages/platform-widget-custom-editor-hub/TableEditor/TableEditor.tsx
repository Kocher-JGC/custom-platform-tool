import React from 'react';
import { Button, Input } from '@infra/ui';
import { RegisterEditor } from '@engine/visual-editor/spec';
import { GeneralTableComp } from '@platform-widget/general-table';
import { CustomEditor } from '@platform-widget-access/spec';
import { genRenderColumn, genRowData } from './utils';

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

  setCol = (item, id) => {
    const { usingColumns } = this.state;
    const itemIdx = usingColumns.findIndex((col) => col.id === id);
    const nextState = genRenderColumn([...usingColumns]);
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
                onClick={(e) => this.setCol(col, id)}
              >
                {name}
              </span>
            );
          })
        }
      </div>
    );
  }

  getChangeValue = () => {
    const { entityState } = this.props;
    const { usingColumns } = this.state;
    const targetData = {
      ...entityState,
      columns: usingColumns
    };
    const resData = [];
    for (const attr in targetData) {
      if (Object.prototype.hasOwnProperty.call(targetData, attr)) {
        const value = targetData[attr];
        resData.push({
          attr,
          value
        });
      }
    }
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
      onSubmit, platformCtx: {
        meta: {
          changeEntityState
        }
      }
    } = this.props;
    const { usingColumns } = this.state

    const rowData = genRowData(usingColumns);
    const colRender = genRenderColumn();
    
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
              changeEntityState(this.getChangeValue());
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
