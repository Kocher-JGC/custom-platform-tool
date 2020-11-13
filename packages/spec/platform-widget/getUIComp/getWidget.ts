import { getUICompHOC } from './getUIComp';
import { PlatformWidgetMeta } from '../interfaces';
import * as Widgets from '../Widgets';

/**
 * 获取组件实例
 */
export const getWidget = getUICompHOC<PlatformWidgetMeta>(Widgets);
