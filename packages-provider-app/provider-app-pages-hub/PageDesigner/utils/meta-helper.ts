import { nanoid } from 'nanoid';
import PageMetadata from '@spec/page-metadata';

export const metaHelper = {
  /**
   * 生成 meta 引用 ID
   */
  genMetaRefID: (metaAttr: string, len = 8) => {
    if (!metaAttr) throw Error('请传入 metaAttr，否则逻辑无法进行');
    const metaID = nanoid(len);
    return `${metaAttr}.${metaID}`;
  },

  /**
   * 获取 meta
   */
  takeMeta: (pageMetadata: PageMetadata) => (options: {
    metaAttr: string, metaRefID: string
  }) => {
    const { metaAttr, metaRefID } = options;
    return metaRefID ? pageMetadata[metaAttr]?.[metaRefID] : pageMetadata[metaAttr];
  }
};
