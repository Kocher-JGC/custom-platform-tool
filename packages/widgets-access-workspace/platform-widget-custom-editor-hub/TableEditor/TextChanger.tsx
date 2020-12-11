import React, { useState } from 'react';
import { Input, Button } from '@infra/ui';

export interface TextChangerProps {
  defaultValue
  onChange
}

export const TextChanger: React.FC<TextChangerProps> = ({
  defaultValue,
  onChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="item">
      {
        isEditing ? (
          <div>
            <Input
              defaultValue={defaultValue}
              className="mb10"
              inputBtnConfig={{
                text: '确定',
                action: (elem) => {
                  onChange(elem.value);
                }
              }}
            />
          </div>
        ) : (
          <div 
            onClick={e => {
              setIsEditing(true);
            }}
          >
            修改显示名
          </div>
        )
      }
    </div>
  );
};