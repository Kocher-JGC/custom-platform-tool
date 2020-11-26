import { PropItemMeta } from '@engine/visual-editor/data-structure';
import { mergeDeep } from '@infra/utils/tools';

// export type PropItemRender = Pick<PropItemCompAccessSpec, 'render'>

export const PropItem = (propItemMeta: PropItemMeta) => {
  const resData = { ...propItemMeta };
  return (SrouceClass): any => {
    // Reflect.defineMetadata('print', 'asdasd', SrouceClass);
    // Reflect.defineMetadata();
    return mergeDeep<PropItemMeta>(resData, new SrouceClass(propItemMeta));
    // return Object.assign(resData, new SrouceClass());
  };
};
