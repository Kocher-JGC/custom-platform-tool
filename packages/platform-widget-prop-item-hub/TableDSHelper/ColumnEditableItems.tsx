import React, { useState } from 'react';
import { Input, Button } from '@infra/ui';
import { ConditionStrategy } from '@platform-widget-access/spec';

export interface ColumnEditableItemsProps {
  defaultValue: ConditionStrategy
  onChange: (nextState: ConditionStrategy) => void
}

export const ColumnEditableItems: React.FC<ColumnEditableItemsProps> = ({
  defaultValue,
  onChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = React.createRef();
  console.log(defaultValue);
  return (
    <div className="item">
      {
        isEditing ? (
          <div>
            <Button 
              onClick={e => {
                onChange(inputRef.current.value);
              }}
            >
              确定
            </Button>
          </div>
        ) : (
          <div 
            onClick={e => {
              setIsEditing(true);
            }}
          >
            查询条件
          </div>
        )
      }
    </div>
  );
};