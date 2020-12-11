import { PlatformWidgetMeta } from '@platform-widget-access/spec';
import * as Widgets from '@platform-widget-access/register/refs-widget';

import { getUICompHOC } from './getUIComp';

/**
 * 获取组件实例
 */
export const getWidget = getUICompHOC<PlatformWidgetMeta>(Widgets);
