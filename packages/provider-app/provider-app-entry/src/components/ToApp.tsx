import React from 'react';
import { getAppPreviewUrl } from '@provider-app/config';

export const ToApp = ({
  appLocation
}) => {
  return (
    <div
      onClick={(e) => {
        // const preWindow = window.open(paasServerUrl);
        // $R_P.post(`${defaultWebServerUrl}/preview-app`, {
        //   lessee: $R_P.urlManager.currLessee,
        //   app: $R_P.urlManager.currApp,
        // });
      }}
    >
      {/* <a
        href={getAppPreviewUrl()}
        className="text-gray-600"
        target="_blank"
      >
        进入应用系统
      </a> */}
    </div>
  );
};
