import React from 'react';
import { Button, Input, DropdownWrapper } from '@infra/ui';
import { RegisterEditor } from '@engine/visual-editor/spec';
import { GeneralTableComp } from '@platform-widget/general-table';
import { PlusOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import { CustomEditor } from '@platform-widget-access/spec';
import Sortable from "sortablejs";
import { genRenderColumn, genRowData } from './utils';

import './index.less';

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

  componentDidMount() {
    this.setupSortableColumnItems();
  }

  setupSortableColumnItems = () => {
    const sortable_list_container = document.querySelector('#sortable_list_container') as HTMLElement;
    if(sortable_list_container) {
      Sortable.create(sortable_list_container, {
        animation: 150,
        ghostClass: 'blue-background-class',
        onSort: (evt) => {
          // console.log(evt);
          const { oldIndex, newIndex } = evt;
          this.setState(({ usingColumns }) => {
            const nextState = [...usingColumns];
            const sortItem = nextState.splice(oldIndex, 1);
            nextState.splice(newIndex, 0, sortItem[0]);
            return {
              usingColumns: nextState
            };
          });
        },
      });
    }
  }

  setUsingColumns = () => {
    const { entityState } = this.props;
    const { columns = [] } = entityState || {};
    return columns;
  }

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
      usingColumns: nextState
    });
  }

  renderColumnSelector = () => {
    const { usingColumns, datasourceMeta } = this.state;
    if(!datasourceMeta) return null;
    const { columns } = datasourceMeta;
    return (
      <DropdownWrapper 
        outside
        overlay={(helper) => {
          return (
            <div
              className="column-selector-container"
            >
              {
                columns.map((col, idx) => {
                  const { name, id } = col;
                  const isSelected = usingColumns.find(uCol => uCol.id === id);
                  return (
                    <div 
                      onClick={(e) => {
                        !isSelected && this.setCol(col, id);
                      }}
                      className={`list-item ${isSelected ? 'disabled' : ''}`}
                      key={id}
                    >
                      {name}
                    </div>
                  );
                })
              }
            </div>
          );
        }}
      >
        <span 
          onClick={e => {
          
          }}
        >
          <PlusOutlined />
        </span>
      </DropdownWrapper>
    );
  }

  renderSelectedColumnEditor = () => {
    const { usingColumns, datasourceMeta } = this.state;
    if(!datasourceMeta) return null;
    return (
      <span id="sortable_list_container" className="flex">
        {
          usingColumns.map((col, idx) => {
            if(!col) return null;
            // console.log(col);
            const { name, id } = col;
            const isActive = usingColumns.find((item) => item && item.id === id);
            return (
              <DropdownWrapper
                key={id}
                className={`column-item idx-${idx} ${isActive ? 'active' : ''}`}
                overlay={(helper) => {
                  return (
                    <div className="column-setting-helper-container">
                      <div className="item">
                          修改显示名
                      </div>
                    </div>
                  );
                }}
              >
                <span style={{ color: 'inherit' }}>
                  <DownOutlined 
                    className="selection __action"
                  />
                  {name}
                  <CloseOutlined
                    className="close __action"
                    onClick={e => {
                      this.setCol(col, id);
                    }}
                  />
                </span>
              </DropdownWrapper>
            );
          })
        }
      </span>
    );
  }

  /**
   * column 的渲染器
   * TODO: 完善更强的 column 的数据结构抽象
   */
  renderSetColumn = () => {
    const { datasourceMeta } = this.state;
    if(!datasourceMeta) return null;
    return (
      <div className="column-selector p-4 flex flex-wrap">
        <div>
          <span className="title">显示字段</span>
          {this.renderColumnSelector()}
        </div>
        {this.renderSelectedColumnEditor()}
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
    // console.log(resData);
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
    const { usingColumns } = this.state;

    const rowData = genRowData(usingColumns);
    // const colRender = genRenderColumn();
    
    return (
      <div className="px-4 py-2">
        {this.renderSetColumn()}
        {/* <div className="p10">
          <Button>变量</Button>
        </div> */}
        <GeneralTableComp 
          rowKey="id" 
          columns={usingColumns} 
          dataSource={rowData}
        />
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
