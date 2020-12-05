import React, { useState, useEffect } from 'react';
import { Table, Radio, Tag, Button, Input } from 'antd';
import { queryTableListService } from '@provider-app/table-structure/service';
import { ModuleTree } from '../PDInfraUI/ModuleTreeRenderer';

interface SelectedRowInfo {
  id: string
  name: string
}
interface TableSelectorProps extends PD.PropItemRendererBusinessPayload {
  /** 提交已选中的项 */
  onSubmit: (selectedRowInfo: SelectedRowInfo) => void
  defaultSelectedInfo?: SelectedRowInfo
  single?: boolean
}
type AuxTableContainer = {[key: string]: boolean}

interface TableConfig {
  moduleId?: string
  lastModifiedByMe?: boolean
  createdByMe?: boolean
  paging: {
    offset: number
    size: number
    total?: number
  }
  list: any[]
  name?: string
}
const useTableList = (defaultPaging = {
  offset: 0,
  size: 10
}): [TableConfig, (paging?: TableConfig['paging']) => void] => {
  
  const [dataList, setList] = useState<TableConfig>({
    name: undefined,
    moduleId: undefined,
    paging: defaultPaging,
    createdByMe: false,
    lastModifiedByMe: false,
    list: []
  });
  const getListByPaging = (param = defaultPaging) => {
    const { name = dataList.name, offset = 0, size = dataList.paging.size, createdByMe = dataList.createdByMe, lastModifiedByMe = dataList.lastModifiedByMe, moduleId = dataList.moduleId } = param;
    queryTableListService({ name, moduleId, createdByMe, lastModifiedByMe, offset, size, addHadAuxTableTag: true }).then((resData) => {
      const { total, data } = resData?.result || {};
      setList({
        name,
        moduleId,
        createdByMe,
        lastModifiedByMe,
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

const TableList: React.FC = ({
  single, onSubmit, defaultSelectedInfo = [], moduleId 
}) => {
  const [{ paging, list, createdByMe, lastModifiedByMe, name }, getTableConfig] = useTableList();
  const [auxTableContainer, setAuxTableContainer] = useState<AuxTableContainer>({});
  useEffect(() => {
    initAuxTableContainer();
  }, []);
  useEffect(()=>{
    const moduleIdParam = moduleId ? { moduleId } : {};
    getTableConfig(moduleIdParam);
  }, [moduleId]);
  /** 渲染回填数据：是否带入附属表 */
  const initAuxTableContainer = () => {
    const result = {};
    defaultSelectedInfo.forEach(item=>{
      const { id, auxTable } = item;
      result[id] = 'containAuxTable' in auxTable ? auxTable.containAuxTable : falase;
    });
    setAuxTableContainer(result);
  };
  /** 拼装提交数据 */
  const getSubmitData = (rows) => {
    return rows.map(item=>{
      const { id, name } = item;
      return {
        id, name, auxTable: {
          containAuxTable: id in containAuxTableRenderer ? containAuxTableRenderer[id] : true
        }
      };
    });
  };
  const containAuxTableRenderer = (id)=>{
    return id in auxTableContainer ? auxTableContainer[id] : true;
  };
  return (
    <>
      <div>
        <Button
          className="mr-4" 
          type={[createdByMe, lastModifiedByMe].includes(true) ? 'text': 'link'}
          onClick={()=>{
            getTableConfig({
              createdByMe: false,
              lastModifiedByMe: false,
            });
          }}
        >所有</Button>
        <Button
          className="mr-4" 
          type={createdByMe===true?'link': 'text'}
          onClick={()=>{
            getTableConfig({
              createdByMe: true,
              lastModifiedByMe: false,
            });
          }}
        >我创建的</Button>
        <Button
          className="mr-4" 
          type={lastModifiedByMe===true?'link': 'text'}
          onClick={()=>{
            getTableConfig({
              createdByMe: false,
              lastModifiedByMe: true,
            });
          }}
        >我最后修改的</Button>
        <span className="flex"></span>
      </div>
      <Input.Search 
        value={name}
        allowClear
        placeholder="请输入表结构名称"
        onSearch={nameTmpl=>{
          getTableConfig({
            name: nameTmpl
          });
        }}
      />
      <Table
        columns={[
          {
            dataIndex: 'name',
            key: 'name',
            title: '表结构名称'
          },
          {
            dataIndex: 'id',
            key: 'id',
            title: '带入附属表',
            render: (_t, _r)=>{
              return _r.hadAuxTable ? (
                <Radio.Group 
                  value={containAuxTableRenderer(_t)}
                  onChange={(e)=>{
                    const { value } = e.target;
                    setAuxTableContainer({
                      ...auxTableContainer,
                      [_t]: value
                    });
                    const itemIndex = defaultSelectedInfo.findIndex(item=>item.id === _t);
                    if( itemIndex > -1 ){
                      const selectedInfo = defaultSelectedInfo.slice();
                      selectedInfo[itemIndex] = Object.assign(selectedInfo[itemIndex], { auxTable: { containAuxTable: value } });
                      onSubmit(selectedInfo);
                    }
                  }}
                >
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              ) : null;
            }
          },
        ]}
        rowSelection={{
          selectedRowKeys: defaultSelectedInfo.map(item=>item.id),
          type: single ? 'radio' : 'checkbox',
          onChange: (rowKeys, rows) => {
            const submitData = getSubmitData(rows);
            onSubmit(submitData);
          },
        }}
        onChange = {(pagination)=>{
          getTableConfig({
            offset: (pagination.current - 1)*pagination.pageSize,
            size: pagination.pageSize,
          });
        }}
        pagination={{
          pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
          size: 'small',
          showSizeChanger: true,
          showQuickJumper: true,
          total: paging.total
        }}
        rowKey="id"
        size="small"
        dataSource={list}
        scroll={{ y: 330 }}
        
      />
    </>
  );
};

export const SelectedTags = ({
  onSubmit, defaultSelectedInfo
}) => {
  return (
    <div className="border border-gray-400 border-solid pl-2 pt-2 overflow-auto" style={{ height: 69 }}>
      { defaultSelectedInfo?.length > 0 ? (
        <Tag
          className="cursor-pointer"
          color="#488CF0"
          style={{ marginBottom: 8 }}
          onClick={e=>{
            onSubmit([]);
          }}
        >
        全部清空
        </Tag>
      ) : null }
      {defaultSelectedInfo.map(item=>(
        <Tag
          onClose = {e=>{
            onSubmit(defaultSelectedInfo.filter(loop=>loop.id !==item.id));
          }} 
          closable
          key={item.id}
        >
          {item.name}
        </Tag>
      ))}
    </div>
  );
};

export const TableSelector: React.FC<TableSelectorProps> = ({
  defaultSelectedInfo,
  onSubmit,
  single
}) => {
  const [moduleId, setModuleId] = useState<React.ReactText>('');
  return (
    <div className="flex">
      <div className="w-1/4 box-border pr-1">
        <ModuleTree onSelect={(selectedModuled)=>{
          setModuleId(selectedModuled);
        }}
        />
      </div>
      <div className="w-3/4">
        <TableList 
          moduleId={moduleId}
          defaultSelectedInfo = {defaultSelectedInfo}
          single={single}
          onSubmit = {onSubmit}
        />
        { !single ? (
          <SelectedTags 
            defaultSelectedInfo = {defaultSelectedInfo}
            onSubmit = {onSubmit}
          />
        ) : null }
      </div>
    </div>
  );
};
