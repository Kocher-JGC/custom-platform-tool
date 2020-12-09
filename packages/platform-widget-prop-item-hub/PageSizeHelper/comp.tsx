import React from "react";
import { Select, Radio } from "antd";
import { PAGE_SIZE_MENU, SHOW_PAGE_SIZE_MENU } from "./constants";

export const PageSizeComp = ({ editingWidgetState, onChange }) => {
  const { defaultPageSize } = editingWidgetState;
  return (
    <>
      <Radio.Group
        className='w-full'
        value={!!defaultPageSize}
        options={SHOW_PAGE_SIZE_MENU}
        onChange={e=>{
          onChange(e.target.value?10:null);
        }}
      ></Radio.Group>
      {!!defaultPageSize ? (
        <>
          <span className="mr-2">默认每页显示</span>
          <Select
            defaultValue={defaultPageSize}
            value={defaultPageSize}
            onChange={(value) => onChange(value)}
            options={PAGE_SIZE_MENU}
          />
          <span className="ml-2">行</span>
        </>
      ) : null}
    </>
  );
};
