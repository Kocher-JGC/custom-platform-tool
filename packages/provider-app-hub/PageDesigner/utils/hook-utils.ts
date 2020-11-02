import { EditableWidgetMeta } from '@engine/visual-editor/data-structure';
import React, { useState, useEffect } from 'react';
import { loadPlatformWidgetMeta } from '../services';

const widgetCache = {};

export const useWidgetMeta = (widgetType: string): [boolean, EditableWidgetMeta] => {
  const [ready, setReady] = useState(!!widgetCache[widgetType]);
  useEffect(() => {
    loadPlatformWidgetMeta(widgetType).then((widget) => {
      widgetCache[widgetType] = widget;
      setReady(true);
    });
  }, []);
  return [
    ready, widgetCache[widgetType]
  ];
};
