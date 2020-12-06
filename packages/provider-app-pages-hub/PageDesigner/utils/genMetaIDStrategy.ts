import { nanoid } from 'nanoid';
import { ChangeMetadataOptions } from "@engine/visual-editor/core";
import { genMetaRefID } from './genMetaRefID';

interface ExternalSetting {
  entityID: string
  forEachCalllback?: (newMetaID: string) => void
}

export const genMetaIDStrategy = (
  options: ChangeMetadataOptions,
  externalSetting: ExternalSetting
) => {
  const {
    entityID,
    forEachCalllback
  } = externalSetting;

  // ts 的 bug，ts 无法通过变量来推断类型是否数据
  const optionsArr = Array.isArray(options) ? options : [options];
  const nextOptions: ChangeMetadataOptions = [];
  optionsArr.forEach((optItem) => {
    const {
      metaAttr,
    } = optItem;

    const nextItem = { ...optItem };

    if(optItem.type === 'create' || optItem.type === 'create/rm') {
      /** 如果是新增 meta */
      const { metaID, data, relyID } = optItem;
      let newMetaID = metaID;
      if(!newMetaID) {
        /** 
         * 如果没有 metaID, 则根据 metaAttr 生成对应的 id 生成策略
         */
        let idStrategy;

        /**
         * 以下为生成对应的 meta 节点数据的 ID 的策略
         */
        switch (metaAttr) {
          case 'dataSource':
            idStrategy = data.id;
            break;
          case 'schema':
            /** 通过绑定 column field code 与组件 id 生成有标志性的 key */
            idStrategy = [data?.column?.fieldCode, entityID];
            break;
          case 'varRely':
            /** 通过绑定外部传入的 rely id 来确认与变量的依赖项的关系 */
            idStrategy = relyID;
            break;
          case 'actions':
            const nanoID = nanoid(8);
            /** 通过生成随机的 id 确保动作的唯一 */
            idStrategy = nanoID;
            break;
          default:
        }

        newMetaID = genMetaRefID(metaAttr, { idStrategy });
      }

      forEachCalllback?.(newMetaID);

      Object.assign(nextItem, {
        metaID: newMetaID,
        relyID
      });
    }

    nextOptions.push(nextItem);
  });

  return nextOptions;
};