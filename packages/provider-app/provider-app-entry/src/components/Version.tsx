import React from "react";

import { VersionDisplayer } from "version-helper";
// import VersionInfo from './version.json';
export const Version = () => {
  const [versionInfo, setVersionInfo] = React.useState();
  React.useEffect(() => {
    // console.log('NODE_ENV :>> ', process.env.NODE_ENV);
    if (process.env.NODE_ENV !== "development") {
      try {
        import("../version.json")
          .then((versionInfoJSON) => {
            setVersionInfo(versionInfoJSON);
          })
          .catch((err) => {});
      } catch (e) {
        console.log("e :>> ", e);
      }
    }
  }, []);
  return versionInfo ? (
    <div className="pr-2 text-gray-600">
      <VersionDisplayer versionInfo={versionInfo} $T={(v) => v} />
    </div>
  ) : null;
};
