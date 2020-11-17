import { ShowModal } from '@infra/ui';
import React from 'react';
import { useCustomEditor } from '../../utils';

export const PDCustomEditorLoader = ({
  entityState,
  propEditor,
  changeEntityState
}) => {
  const [ready, PropEditor] = useCustomEditor(propEditor);
  if (!propEditor) return null;
  /** 自定义编辑器的接口 */
  return (
    <span className="custom-editor-loader">
      <span
        className="default btn"
        onClick={(e) => {
          e.stopPropagation();
          ShowModal({
            title: '编辑表格',
            width: `80vw`,
            children: ({ close }) => {
              return (
                <PropEditor
                  onSubmit={() => {
                    close();
                  }}
                  entityState={entityState}
                  changeEntityState={changeEntityState}
                />
              );
            }
          });
        }}
      >
      编辑
      </span>
    </span>
  );
};
