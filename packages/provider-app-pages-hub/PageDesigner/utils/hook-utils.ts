/* eslint-disable react-hooks/rules-of-hooks */
import { GroupPanelData } from '@engine/visual-editor/components/GroupPanel';
import { EditableWidgetMeta, WidgetTypeMetadataCollection } from '@engine/visual-editor/data-structure';
import React, { useState, useEffect } from 'react';
import { loadCustomEditor, loadPlatformWidgetMeta, loadWidgetPanelData } from '../services';

export const useResourceFac = <T>(
  api
) => {
  const resourceCache = {};
  return (resID = ''): [boolean, T] => {
    const [ready, setReady] = useState(!!resourceCache[resID]);
    useEffect(() => {
      api(resID).then((res) => {
        resourceCache[resID] = res;
        setReady(true);
      });
    }, []);
    return [
      ready, resourceCache[resID]
    ];
  };
};

export const useWidgetMeta = useResourceFac<WidgetTypeMetadataCollection>(
  loadPlatformWidgetMeta
);

// const widgetMetaCache = {};
// export const useWidgetPanelData = (resID) => {
//   const [ready, setReady] = useState(!!widgetMetaCache[resID]);
//   useEffect(() => {
//     loadPlatformWidgetMeta(resID).then((res) => {
//       console.log(res);
//       widgetMetaCache[resID] = res;
//       setReady(true);
//     });
//   }, []);
//   return [
//     ready, widgetMetaCache[resID]
//   ];
// };
export const useWidgetPanelData = useResourceFac<GroupPanelData>(
  loadWidgetPanelData
);

export const useCustomEditor = useResourceFac<GroupPanelData>(
  loadCustomEditor
);
// export const useWidgetMeta = (widgetType: string): [boolean, EditableWidgetMeta] => {
//   const [ready, setReady] = useState(!!widgetCache[widgetType]);
//   useEffect(() => {
//     loadPlatformWidgetMeta(widgetType).then((widget) => {
//       widgetCache[widgetType] = widget;
//       setReady(true);
//     });
//   }, []);
//   return [
//     ready, widgetCache[widgetType]
//   ];
// };
