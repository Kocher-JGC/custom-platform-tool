import React, { useEffect, useState } from 'react';
import { Radio, InputNumber } from 'antd';
import { PropItemRenderContext, CustomEditor, PTColumn } from '@platform-widget-access/spec';
import { Button, Input, DropdownWrapper, ShowModal } from '@infra/ui';
import { PlusOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import Sortable from "sortablejs";
import { genRenderColumn, genRowData } from './utils';
import pick from 'lodash/pick';

interface TableDSHelperCompProps extends PropItemRenderContext {
  whichAttr: string
}

interface TableEditorState {
  datasourceMeta: PD.Datasource
  usingColumns: PTColumn[]
}

const takeTableInfo = (_tableInfo) => {
  return _tableInfo.name;
};

export class TableDSHelperComp extends React.Component<TableDSHelperCompProps, TableEditorState> {
  constructor(props) {
    super(props);

    const datasourceMeta = this.takeDS();

    this.state = {
      datasourceMeta,
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

            this.onSetCol(nextState);

            return {
              usingColumns: nextState
            };
          });
        },
      });
    }
  }

  takeDS = () => {
    const { platformCtx, editingWidgetState } = this.props;
    const { ds } = editingWidgetState;
    if(!ds) return null;
    const { takeMeta } = platformCtx.meta;
    const dsMeta = takeMeta({
      metaAttr: 'dataSource',
      metaRefID: ds
    });
    return dsMeta;
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
    }, () => this.setupSortableColumnItems());

    this.onSetCol(nextState);
  }

  onSetCol = (nextState) => {
    const { changeEntityState } = this.props;

    changeEntityState({
      attr: 'columns',
      value: nextState.map(item=>({ ...item, width: item.width || 60 }))
    });
  }

  setUsingColumns = () => {
    const { editingWidgetState } = this.props;
    const { columns } = editingWidgetState || {};
    return columns || [];
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
        <span className="title flex items-center">
          <span>显示字段</span>
          <PlusOutlined
            style={{
              display: 'inline-block',
              // fontSize: 16
            }}
          />
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
            const { name, id, title, alias, conditionStrategy, rowRenderStrategy } = col;
            const displayName = title || name || alias;
            // const isActive = usingColumns.find((item) => item && item.id === id);
            return (
              <div 
                className={`column-item idx-${idx}`}
                style={{ color: 'inherit' }}
                key={id}
              >
                <span
                  onClick={e => {
                    ShowModal({
                      title: '编辑列',
                      type: 'side',
                      position: 'right',
                      children: () => {
                        return (
                          <div>
                            这里编辑列
                          </div>
                        );
                      }
                    });
                  }}
                >
                  <DownOutlined 
                    className="selection __action"
                  />
                  {displayName}
                </span>
                <CloseOutlined
                  className="close __action"
                  onClick={e => {
                    this.setCol(col, id);
                  }}
                />
              </div>
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
      <div className="column-selector p-4">
        <div className="mb10">
          {this.renderColumnSelector()}
        </div>
        {this.renderSelectedColumnEditor()}
      </div>
    );
  }

  setDatasourceMetaForSelf = (datasourceMeta) => {
    this.setState({
      datasourceMeta
    });
  }

  render() {
    const {
      changeEntityState,
      whichAttr,
      editingWidgetState,
      platformCtx,
    } = this.props;
  
    const {
      changePageMeta,
      takeMeta,
      genMetaRefID,
    } = platformCtx.meta;

    const { datasourceMeta } = this.state;
    // console.log(datasourceMeta);
    // 选项数据源的引用
    const DSOptionsRef = editingWidgetState[whichAttr] as string | undefined;
  
    const dsBinder = (
      <div 
        className="px-4 py-2 border cursor-pointer"
        onClick={e => {
          platformCtx.selector.openDatasourceSelector({
            defaultSelected: datasourceMeta ? [datasourceMeta] : [],
            modalType: 'normal',
            position: 'top',
            single: true,
            typeArea: ['TABLE'],
            onSubmit: ({ close, interDatasources }) => {
              // 由于是单选的，所以只需要取 0
              const bindedDS = interDatasources[0];

              close();
              
              if(DSOptionsRef && DSOptionsRef.indexOf(bindedDS.id) !== -1) return;
              const nextMetaID = changePageMeta({
                type: 'create/rm',
                metaAttr: 'dataSource',
                // metaID: DSOptionsRef,
                rmMetaID: DSOptionsRef,
                data: bindedDS
                // metaID:
              });
              changeEntityState({
                attr: whichAttr,
                value: nextMetaID
              });
              this.setDatasourceMetaForSelf(bindedDS);
            }
          });
        }}
      >
        {datasourceMeta ? takeTableInfo(datasourceMeta) : '点击绑定'}
      </div>
    ); 
  
    return (
      <div>
        {
          dsBinder
        }
        {this.renderSetColumn()}
      </div>
    );
  }
}
