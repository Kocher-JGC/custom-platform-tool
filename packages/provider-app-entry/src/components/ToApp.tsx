import { getPreviewUrl } from '@provider-app/config/getPreviewUrl';
import React from 'react';

export const ToApp = ({
  appLocation
}) => {
  return (
    <div
      onClick={(e) => {
        // const preWindow = window.open(appUrl);
        // $R_P.post(`${defaultWebServerUrl}/preview-app`, {
        //   lessee: $R_P.urlManager.currLessee,
        //   app: $R_P.urlManager.currApp,
        // });
      }}
    >
      <a
        href={getPreviewUrl()}
        className="text-gray-600"
        target="_blank"
      >
        进入应用系统
      </a>
    </div>
  );
};
