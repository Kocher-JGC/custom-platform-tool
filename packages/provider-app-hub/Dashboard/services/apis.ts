function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  throw error;
}

export async function downloadBackEnd(appAccessCode: string, fileName: string) {
  return fetch(`${$R_P.config.baseUrl}/manage/v1/applications/export/${appAccessCode}`, {
    headers: $R_P.config.commonHeaders,
  }).then((res) => res.blob().then((blob) => {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${fileName}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  }));
}

export async function downloadFrontEnd(accessName: string, fileName: string, id: string | number) {
  return fetch(`${window.$AppConfig.nodeWebServerUrl}/node-web/release-app/${$R_P.urlManager.currLessee}/${accessName}?releaseId=${id}`, {
    method: "GET",
    headers: $R_P.config.commonHeaders,
  }).then(checkStatus).then((res) => res.blob().then((blob) => {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${fileName}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  }));
}
