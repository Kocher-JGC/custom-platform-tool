import React from "react";
import { Checkbox, Select } from "antd";
import { QUEYR_TYPE_MENU, QUERY_STYLE_MENU } from "./constants";
import pick from 'lodash/pick';

export const QueryStyleComp = ({ onChange, value }) => {
  return (
    <div className="prop-query-style my-1">
      <span>查询框位置</span>
      <Select 
        value = {value}
        onChange={onChange}
        options={QUERY_STYLE_MENU}
      />
    </div>
  );
};
export const QueryTypeComp = ({ editingWidgetState, onChange }) => {
  const { queryType } = editingWidgetState;
  console.log(queryType);
  const handleChangeQueryStyle=(type, value)=>{
    onChange({
      ...queryType,
      [type]: value
    });
  };
  return (
    <>
      <Checkbox.Group
        className='w-full'
        value={queryType ? Object.keys(queryType).filter(item=>!!queryType[item]) : []}
        onChange={value=>{
          const result = pick(queryType, value);
          value.forEach(item=>{
            if(!(item in result)){
              result[item] = 'asForm';
            }
          });          
          onChange(result);
        }}  
      >
        <Checkbox value="typical">普通查询</Checkbox>
        <br/>
        {'typical' in queryType && queryType['typical'] ? (
          <QueryStyleComp value={queryType['typical']} onChange={(value)=>handleChangeQueryStyle('typical', value)}/>
        ) : null }
        <Checkbox value="special">高级查询（暂未支持）</Checkbox>
        <br/>
        {'special' in queryType && queryType['special'] ? (
          <QueryStyleComp value={queryType['special']} onChange={(value)=>handleChangeQueryStyle('special', value)}/>
        ) : null }
        <Checkbox value="keyword">关键字查询（暂未支持）</Checkbox>
      </Checkbox.Group>
    </>
  );
};
