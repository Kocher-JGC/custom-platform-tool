import { PlatformWidgetMeta } from '@platform-widget-access/spec';
import { getUICompHOC } from './getUIComp';
import * as Widgets from '../refs-widget';

/**
 * 获取组件实例
 */
export const getWidget = getUICompHOC<PlatformWidgetMeta>(Widgets);
