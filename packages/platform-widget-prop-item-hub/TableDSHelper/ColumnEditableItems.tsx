import React, { useState } from 'react';
import { Divider, InputNumber, Radio } from 'antd';
import { Input, Button, Select  } from '@infra/ui';

type BasicColumn = {
  title: string
  width: string
  show: boolean
  editable?: boolean
  align?: 'left'|'center'|'right'

}
export type DSColumn = {
  type: 'dsColumn'
  fieldCode: string
  tableTitle: string
}
export type Column = BasicColumn & DSColumn
export interface ColumnEditableItemsProps {
  defaultValue: Column
  onChange: (nextState: Column) => void
}
/** 
 * 编辑单元 
 */
const Editor = ({ title,  children })=>{
  return (
    <div className="mb10">
      <div className="label mb5">{title}</div>
      <div className="content">
        {children()}
      </div>
    </div>
  );
};

/**
 * 列宽
 */
/** 列宽单位列表 */
const WIDTH_MENU = [
  { key: '%', value: '%', label: '%' },
  { key: 'px', value: 'px', label: 'px' },
];
type Width = {widthNum: number|undefined, unit: string}
type GetWidth = (param:{widthNum?: string|number|undefined, unit?: string})=>string
const useWidth = (param = ''):[Width, GetWidth] => {
  const [width, setWidth] = useState<Width>({
    widthNum: param ? parseFloat(param) : undefined,
    unit: !param ? 'px' : param.replace(parseFloat(param).toString(), '')
  });
  const getWidth: GetWidth = ({ widthNum, unit }) => {
    if(!widthNum){
      widthNum = width.widthNum;
    }else if(typeof widthNum === 'string'){
      widthNum = parseFloat(widthNum);
      widthNum = widthNum ? widthNum : width.widthNum;
    }
    unit = unit || width.unit;
    setWidth({ widthNum, unit });
    return `${widthNum||''}${unit||''}`;
  };
  return [width, getWidth];
};
const ColumnWidthEditor = ({ value, onChange })=>{
  const [{ widthNum, unit }, getWidth] = useWidth(value);
  return (<>
    <div>
      <InputNumber 
        onChange={(value)=>{
          onChange(getWidth({ widthNum: value }));
        }}
        value={widthNum}
      />
      <Select 
        onChange={(value)=>{
          onChange(getWidth({ unit: value }));
        }}
        options={WIDTH_MENU} 
        value={unit}
      />
    </div>
    {false ? (<span className="text-red-500">
      请输入正确的宽度数据（两位小数的正数+单位）
    </span>):null}
  </>);
};

/**
 * 是、否、表达式（TODO）
 * @param param0 
 */
const YN = ({ value, onChange })=>{
  return (
    <Radio.Group
      value={value} onChange={(e)=>{
        onChange(e.target.value);
      } }
    >
      <Radio value={true}>是</Radio>
      <Radio value={false}>否</Radio>
    </Radio.Group>
  );
};
/**
 * 对齐
 * @param param0 
 */
const Align = ({ value, onChange }) => {
  return (
    <Select 
      onChange={(value)=>{
        onChange(value);
      }}
      value={value}
    >
      <Select.Option value="left">居左</Select.Option>
      <Select.Option value="center">居中</Select.Option>
      <Select.Option value="right">居右</Select.Option>
    </Select>
  );
};
/**
 * 列属性编辑面板
 * @param param0 
 */
export const ColumnEditableItems: React.FC<ColumnEditableItemsProps> = ({
  defaultValue,
  onChange
}) => {
  const inputRef = React.createRef();
  const [data, setData] = useState(defaultValue);
  return (
    <div className="column-editor" id="columnEditor">
      <div className="edit-area group-panel-container">
        <div className="item-group">
          <div className="group-title">基本属性</div>
          <div className="items-content">
            <Editor
              title="字段名称" children={()=>{
                return (<Input
                  value={data.title || ''}
                  onChange={(value) => setData({
                    ...data,
                    title: value
                  })}
                />);
              }}
            />
            <Editor
              title="字段编码" children={()=>{
                return <span className="__label bg_default t_white">{data.fieldCode}</span>;
              }}
            />
            <Editor
              title="列宽" children={()=>{
                return (<ColumnWidthEditor 
                  value={data.width}
                  onChange={(value) => {
                    setData({
                      ...data,
                      width: value
                    });}}
                />);}}
            />
            <Editor
              title="是否显示" children={()=>{
                return (<YN 
                  value={data.show}
                  onChange={(value) => {
                    setData({
                      ...data,
                      show: value
                    });}}
                />);}}
            />
            <Editor
              title="是否可编辑" children={()=>{
                return (<YN 
                  value={data.editable || false}
                  onChange={(value) => {
                    setData({
                      ...data,
                      editable: value
                    });}}
                />);}}
            />
            <Editor
              title="对齐方式" children={()=>{
                return (<Align 
                  value={data.align || "left"}
                  onChange={(value) => {
                    setData({
                      ...data,
                      align: value
                    });}}
                />);}}
            />
          </div>
        </div>
        <div className="item-group">
          <div className="group-title">列数据源</div>
          <div className="items-content">
            <Editor
              title="表名"  children={()=>{
                return <span className="__label bg_default t_white">{data.tableTitle}</span>;
              }}
            />
          </div>
        </div>
      </div>
      <div className="confirm-area">
        <Divider className="divider"/>
        <Button 
          className="m-2 float-right"
          size="sm"
          onClick={e => {
            onChange(data);
          }}
        >
              确定
        </Button>
      </div>
        
    </div>
  );
};