import React from 'react';
import { PopModelSelector } from '@infra/ui';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
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
@PropItem({
  id: 'prop_field',
  name: 'PropField',
  label: '列',
  whichAttr: 'field',
  useMeta: metaAttr,
})
export class FieldHelperSpec {
  /**
   * 检查该 column 是否已经被其他控件绑定
   */
  checkColumnIsBeUsed = (_selectedField: SelectedField, schema) => {
    return new Promise((resolve, reject) => {
      for (const sID in schema) {
        const fieldCode = _selectedField.column?.fieldCode;
        console.log(_selectedField.column);
        if (!fieldCode || sID.indexOf(fieldCode) !== -1) {
          reject();
          break;
        }
      }
      resolve();
    });
  };

  render({
    editingWidgetState,
    changeEntityState,
    platformCtx
  }: PropItemRenderContext) {
    const {
      changePageMeta,
      takeMeta,
      genMetaRefID,
    } = platformCtx.meta;
    const currMetaRefID = editingWidgetState.field;
    const selectedField = takeMeta({
      metaAttr: 'schema',
      metaRefID: currMetaRefID
    }) as SelectedField;

    const schema = takeMeta({
      metaAttr: 'schema',
    }) as {
      [sID: string]: SelectedField
    };

    const datasource = takeMeta({
      metaAttr: 'dataSource',
    });

    const interDatasources = Object.values(datasource);

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
                    const prevMetaRefID = currMetaRefID;
                    this.checkColumnIsBeUsed(_selectedField, schema)
                      .then(() => {
                        const nextMetaRefID = changePageMeta({
                          data: _selectedField,
                          metaAttr,
                          metaID: currMetaRefID,
                          // 将上一个 meta 删除
                          rmMetaID: prevMetaRefID
                        });

                        changeEntityState({
                          attr: 'field',
                          value: nextMetaRefID
                        });

                        close();
                      })
                      .catch(() => {
                        platformCtx.ui.showMsg({
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
}
