import { ShowModal } from '@infra/ui';
import React from 'react';
import { PlatformContext, useCustomEditor } from '../../utils';

const PropEditorWrapper = ({
  entityState,
  changeEntityState,
  platformCtx,
  propEditor,
  onSubmit,
}) => {
  const [ready, PropEditor] = useCustomEditor(propEditor);
  if (!ready) return null;
  return (
    <PropEditor
      onSubmit={() => {
        onSubmit?.();
      }}
      platformCtx={platformCtx}
      entityState={entityState}
      changeEntityState={changeEntityState}
    />
  );
};

export const PDCustomEditorLoader = ({
  entityState,
  propEditor,
  changeEntityState
}) => {
  if(!propEditor) return null;
  /** 自定义编辑器的接口 */
  return (
    <PlatformContext.Consumer>
      {
        (platformCtx) => {
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
                        <PropEditorWrapper
                          propEditor={propEditor}
                          onSubmit={() => {
                            close();
                          }}
                          platformCtx={platformCtx}
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
        }
      }
    </PlatformContext.Consumer>
  );
};
