import { PropItemMeta } from '@engine/visual-editor/data-structure';
import { mergeDeep } from '@infra/utils/tools';
import { CustomEditorMeta } from ".";

// export type PropItemRender = Pick<PropItemCompAccessSpec, 'render'>

export const CustomEditor = (meta: CustomEditorMeta) => {
  const resData = { ...meta };
  return (SrouceClass): any => {
    return mergeDeep<PropItemMeta>(resData, new SrouceClass(meta));
  };
};
