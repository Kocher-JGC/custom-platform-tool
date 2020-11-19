import React, { useEffect, useState } from 'react';
import { queryTableListService } from '@provider-app/table-structure/service';
import { Table, Button } from 'antd';
import { getDictionaryListServices } from '@provider-app/services';
// import { wrapInterDatasource } from '../../services/datasource';
// import { TableSelector } from './TableSelector';
import { DictSelector, DictSubItems } from './DictSelector';
import { wrapInterDatasource } from './utils';

interface SubmitItem {
  id: string
  type: string
}

interface DataSourceBinderProps {
  onSubmit: (submitItems: SubmitItem[], interDatasources: PD.Datasources) => void
  bindedDataSources: ({id: string})[]
  /** 是否单选 */
  single?: boolean
  type: 'TABLE' | 'DICT'
}

interface TableList {
  paging: {
    offset: number
    size: number
    total?: number
  }
  list: any[]
}
const useTableList = (type, defaultPaging = {
  offset: 0,
  size: 10
}): [TableList, (paging?: TableList['paging']) => void] => {
  let reqFunc;
  switch (type) {
    case 'TABLE':
      reqFunc = queryTableListService;
      break;
    case 'DICT':
      reqFunc = getDictionaryListServices;
      break;
  }
  if(!reqFunc) {
    throw Error(`未找到 type = ${type} 对应的请求接口`);
  }
  const [dataList, setList] = useState<TableList>({
    paging: defaultPaging,
    list: []
  });
  const getListByPaging = (pagingOptions = defaultPaging) => {
    const { offset = 0, size = dataList.paging.size } = pagingOptions;
    reqFunc(pagingOptions).then((resData) => {
      const { total, data } = resData?.result || {};
      setList({
        paging: {
          offset,
          size,
          total
        },
        list: data
      });
    });
  };
  useEffect(() => {
    getListByPaging();
  }, []);
  return [dataList, getListByPaging];
};

const columns = [
  {
    key: 'name',
    dataIndex: 'name',
    title: '表结构名称',
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: '是否带入附属表',
  },
];

const getItem = (dataSource, ids: string[]) => {
  const res: any[] = [];
  ids.forEach((id) => {
    const item = dataSource.find((item) => item.id === id);
    res.push(item);
  });
  return res;
};

// const useTableSelection = (defaultValue: string[] = []): [any, (selection) => void] => {
//   const [selection, setSelection] = useState(defaultValue);
//   return [selection, setSelection];
// };

/**
 * 获取默认的 dataSource 数据
 * @param bindedDataSources
 */
const getDefaultDataSourceData = (bindedDataSources: any[] = []) => {
  if(!bindedDataSources) {
    // console.warn(`注意，DataSourceSelector 中的 bindedDataSources 被传入了空值`);
    return {
      keys: [],
      rowItems: []
    };
  }
  const keys = bindedDataSources.map((item) => item.id);
  return {
    keys,
    rowItems: bindedDataSources
  };
};


interface SelectedRowInfo {
  keys: string[]
  rowItems: any[]
}
// const interDatasources = await takeDatasources(addingDataFormRemote);
// const nextDSState = {};
// interDatasources.forEach((dsItem, idx) => {
//   nextDSState[this.genDatasourceMetaID(idx)] = dsItem;
// });

export const DataSourceSelector: React.FC<DataSourceBinderProps> = (props) => {
  const { bindedDataSources, single = false, type, onSubmit } = props;
  const [dataList, getDataList] = useTableList(type);
  // const [selectedRowInfo, onSelectChange] = useTableSelection(
  //   getDefaultDataSourceData(bindedDataSources)
  // );
  const [{ keys: selectedRowKeys, rowItems }, onSelectChange] = useState<SelectedRowInfo>(
    getDefaultDataSourceData(bindedDataSources)
  );
  const rowKey = 'id';
  // console.log(dataList);
  const { list, paging } = dataList;
  const tablePaging = {
    current: paging.offset + 1,
    total: paging.total,
    pageSize: paging.size,
  };
  let expandableElem;
  switch (type) {
    case 'TABLE':
      
      break;
    case 'DICT':
      expandableElem = {
        expandedRowRender: (record) => {
          // console.log(record);
          return (
            <DictSubItems
              dictID={record[rowKey]}
            />
          );
        },
        expandedRowKeys: selectedRowKeys,
      };
      break;
  }
  return (
    <div className="data-source-binder p20">
      <Table
        rowKey={rowKey}
        size="small"
        onChange={(pagination) => {
          // console.log(pagination);
          getDataList({
            offset: pagination.current - 1,
            size: pagination.pageSize,
          });
        }}
        columns={columns}
        dataSource={list}
        pagination={tablePaging}
        rowSelection={{
          selectedRowKeys,
          type: single ? 'radio' : 'checkbox',
          onChange: (rowKeys, rowItems) => {
            onSelectChange({
              keys: rowKeys,
              rowItems
            });
          },
        }}
        expandable={expandableElem}
      />
      <Button
        onClick={(e) => {
          // const submitData = getItem(list, selectedRowKeys);
          const interDatasources = wrapInterDatasource(rowItems, type);
          onSubmit(rowItems, interDatasources);
        }}
      >
        确定
      </Button>
    </div>
  );
};
