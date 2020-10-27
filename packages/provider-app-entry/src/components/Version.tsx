import React from 'react';

import { VersionDisplayer } from 'version-helper';
// import VersionInfo from './version.json';
export const Version = () => {
  const [versionInfo, setVersionInfo] = React.useState();
  React.useEffect(() => {
    // try {
    //   import('../version.json').then((versionInfoJSON) => {
    //     setVersionInfo(versionInfoJSON);
    //   }).catch((err) => {});
    // } catch(e) {
    //   console.log('e :>> ', e);
    // }
  }, []);
  return versionInfo ? (
    <VersionDisplayer versionInfo={versionInfo} $T={(v) => v} />
  ) : null;
};
