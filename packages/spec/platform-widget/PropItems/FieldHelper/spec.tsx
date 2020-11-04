import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { PopModelSelector } from '@infra/ui';
import { FieldSelector, SelectedField } from './comp';

const takeBindColumnInfo = (selectedField: SelectedField) => {
  const { column, tableInfo } = selectedField;
  return `${tableInfo?.name}_${column?.name}`;
};

/** 属性项编辑的组件属性 */
const whichAttr = 'field';

const metaAttr = 'schema';

/**
 * 绑定数据列
 */
export const FieldHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_field',

  label: '列',

  whichAttr,

  useMeta: metaAttr,

  render({
    businessPayload,
    editingWidgetState,
    changeEntityState,
    changeMetadata,
    takeMeta,
    genMetaRefID,
    UICtx
  }) {
    const { interDatasources } = businessPayload;
    const currMetaRefID = editingWidgetState[whichAttr];
    const selectedField = takeMeta({
      metaAttr,
      metaRefID: currMetaRefID
    }) as SelectedField;
    const schema = takeMeta({
      metaAttr,
    }) as {
      [sID: string]: SelectedField
    };

    /**
     * 检查该 column 是否已经被其他控件绑定
     */
    const checkColumnIsBeUsed = (_selectedField: SelectedField) => {
      return new Promise((resolve, reject) => {
        for (const sID in schema) {
          const fieldCode = _selectedField.column?.fieldCode;
          if (!fieldCode || sID.indexOf(fieldCode) !== -1) {
            reject();
            break;
          }
        }
        resolve();
      });
    };

    return (
      <PopModelSelector
        modelSetting={{
          title: '绑定列',
          width: 900,
          children: ({ close }) => {
            return (
              <div>
                <FieldSelector
                  interDatasources={interDatasources}
                  defaultSelected={selectedField}
                  onSubmit={(_selectedField) => {
                    const fieldCode = _selectedField.column?.fieldCode;
                    const prevMetaRefID = currMetaRefID;
                    checkColumnIsBeUsed(_selectedField)
                      .then(() => {
                        const nextMetaRefID = genMetaRefID(`s.${fieldCode}`);
                        changeEntityState({
                          attr: whichAttr,
                          value: nextMetaRefID
                        });
                        changeMetadata({
                          data: _selectedField,
                          metaAttr,
                          metaID: nextMetaRefID,
                          // 将上一个 meta 删除
                          rmMetaID: prevMetaRefID
                        });
                        close();
                      })
                      .catch(() => {
                        UICtx.utils.showMsg({
                          msg: '已被其他控件绑定',
                          type: 'error'
                        });
                      });
                  }}
                />
              </div>
            );
          }
        }}
      >
        {currMetaRefID && selectedField ? takeBindColumnInfo(selectedField) : '点击绑定字段'}
      </PopModelSelector>
    );
  }
};
