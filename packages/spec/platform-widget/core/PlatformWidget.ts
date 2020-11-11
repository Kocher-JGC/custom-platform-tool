import { PropItemMeta } from '@engine/visual-editor/data-structure';
import { mergeDeep } from '@infra/utils/tools';
import { PlatformWidgetMeta } from ".";

// export type PropItemRender = Pick<PropItemCompAccessSpec, 'render'>

export const PlatformWidget = (widgetMeta: PlatformWidgetMeta) => {
  const resData = { ...widgetMeta };
  return (SrouceClass): any => {
    // Reflect.defineMetadata();
    return mergeDeep<PropItemMeta>(resData, new SrouceClass(widgetMeta));
    // return Object.assign(resData, new SrouceClass());
  };
};
