import { getPreviewUrl } from '@provider-app/config/getPreviewUrl';
import React from 'react';

const defaultAppUrl = 'http://localhost:8000/preview?path=/preview&mode=preview&pageId=xxxxxx';

const defaultWebServerUrl = 'http://localhost:3000';

export const ToApp = ({
  location
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
        target="_blank"
        style={{ color: "white" }}
      >
        进入应用系统
      </a>
    </div>
  );
};
