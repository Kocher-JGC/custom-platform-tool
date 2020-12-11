import React from 'react';
import { Table, Form } from 'antd';
import without from 'lodash/without';
import { ROW_SELECT_TYPE } from '../constants';

class ExpandedInfoEditor extends React.Component {
  state: {
    selectedRowKeys: string[]
  } = {
    selectedRowKeys: []
  }

  selectType = ROW_SELECT_TYPE.RADIO

  setNewSelectedRowKeys = (rowKey: string) => {
    let { selectedRowKeys } = this.state;
    if (this.selectType === ROW_SELECT_TYPE.CHECKBOX) {
      selectedRowKeys = selectedRowKeys.includes(rowKey)
        ? without(selectedRowKeys, rowKey)
        : [...selectedRowKeys, rowKey];
    } else {
      selectedRowKeys = [rowKey];
    }
    this.setState({
      selectedRowKeys
    });
  }

  resetSelectedRowKeys = (selectedRowKeys: string[]) => {
    this.setState({
      selectedRowKeys
    });
  }

  render() {
    const {
      title, actionAreaRenderer, columns, dataSource, rowSelectionType, expandable,
      blurRow, clickRow, doubleClickRow, formRef, changeValue, rowKey = 'id', className
    } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <div className={`${className} common-table`}>
        <div className="t-header flex">
          <div className="title">{title}</div>
          <span className="flex"></span>
          <div className="action-area">
            {actionAreaRenderer(selectedRowKeys)}
          </div>
        </div>
        <div className="t-body">
          <Form
            ref={formRef}
            onValuesChange = {changeValue}
          >
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              rowKey={rowKey}
              scroll={{ x: '100%' }}
              expandable = {expandable}
              rowSelection = {rowSelectionType ? {
                type: rowSelectionType,
                selectedRowKeys,
                hideSelectAll: true,
                fixed: true
              } : undefined}
              onRow={(record, index) => {
                return {
                  onBlur: (event) => { blurRow(record, index); },
                  onDoubleClick: (event) => {
                    doubleClickRow(record, index);
                    event.stopPropagation();
                  },
                  onClick: (event) => {
                    this.setNewSelectedRowKeys(record.id);
                    clickRow && clickRow();
                  }
                };
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
export default ExpandedInfoEditor;
