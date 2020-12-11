import React from "react";
import { Radio, Select } from "antd";
import { CHECK_ROW_MENU, CHECK_ROW, SELECTED_ROW_MENU } from "./constants";

export const CheckRowComp = ({ editingWidgetState, onChange }) => {
  const { rowCheckType, checkedRowsStyle } = editingWidgetState;
  // const [showPageSize, setShowPageSize] = useState<boolean>(!!pageSize);
  return (
    <>
      <Radio.Group
        className='w-full'
        value={rowCheckType}
        options={CHECK_ROW_MENU}
        onChange={e=>{
          onChange('rowCheckType', e.target.value );
        }}
      />
      {[CHECK_ROW.multi, CHECK_ROW.single].includes(rowCheckType) ? (
        <div className="mt-4">
          <span className="label mb5">选中形式</span>
          <Select
            className="content"
            style={{ width: "100%" }}
            defaultValue={checkedRowsStyle}
            value={checkedRowsStyle}
            onChange={(value) => onChange('checkedRowsStyle', value )}
            options={SELECTED_ROW_MENU}
          />
        </div>
      ) : null}      
    </>
  );
};
