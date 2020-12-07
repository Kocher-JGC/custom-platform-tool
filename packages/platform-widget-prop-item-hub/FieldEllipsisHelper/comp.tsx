import React from "react";
import { Radio } from "antd";
import { FIELD_ELLIPSIS_MENU } from "./constants";

export const FieldEllipsisComp = ({ editingWidgetState, onChange }) => {
  const { fieldEllipsis } = editingWidgetState;
  // const [showPageSize, setShowPageSize] = useState<boolean>(!!pageSize);
  return (
    <>
      <Radio.Group
        className='w-full'
        value={!!fieldEllipsis}
        options={FIELD_ELLIPSIS_MENU}
        onChange={e=>{
          onChange(e.target.value);
        }}
      ></Radio.Group>
    </>
  );
};
