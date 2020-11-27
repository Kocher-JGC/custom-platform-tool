import React from 'react';
import {
  CloseModal, Input, Selector, ShowModal
} from '@infra/ui';
import { ChangeEntityState } from '@platform-widget-access/spec';
import { ExpEditor } from './ExpEditor';

/**
 * 可用的值的类型
 */
const selectTypes = {
  costomValue: '自定义',
  expression: '表达式',
  variable: '变量',
};

/**
 * ValueHelperProps
 */
interface ValueHelperProps {
  editingWidgetState
  onChange: ChangeEntityState
}

/**
 * ValueHelper
 * @param param0
 */
export const ValueHelper: React.FC<ValueHelperProps> = ({
  editingWidgetState,
  onChange,
}) => {
  const [selectedItem, setSelectedItem] = React.useState('costomValue');
  const { exp, realVal, variable } = editingWidgetState;
  let Comp;
  switch (selectedItem) {
    case 'costomValue':
      Comp = (
        <Input
          value={realVal || ''}
          onChange={(value) => onChange([
            { value, attr: 'realVal' },
            /** 需要将 value 清空 */
            { value: null, attr: 'exp' },
          ])}
        />
      );
      break;
    case 'expression':
      Comp = (
        <div
          className="px-4 py-2 border"
          onClick={(e) => {
            const modalID = ShowModal({
              title: '表达式编辑',
              width: 900,
              children: () => {
                return (
                  <ExpEditor
                    defaultValue={exp}
                    onSubmit={(val) => {
                      onChange([
                        { value: val, attr: 'exp' },
                        { attr: 'realVal', value: null }
                      ]);
                      CloseModal(modalID);
                    }}
                  />
                );
              }
            });
          }}
        >
          {exp ? '已设置表达式' : '点击设置表达式'}
        </div>
      );
      break;
    case 'variable':

      break;
  }

  return (
    <div className="value-helper">
      <div className="mb-2">
        <Selector
          needCancel={false}
          value={selectedItem}
          values={selectTypes}
          onChange={(val) => setSelectedItem(val)}
        />
      </div>
      <div>
        {Comp}
      </div>
    </div>
  );
};
