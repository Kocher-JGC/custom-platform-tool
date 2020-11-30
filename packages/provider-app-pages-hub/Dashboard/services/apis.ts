function checkStatus(res) {
  console.log(res);
  if (res.status >= 200 && res.status < 300) {
    return res;
  }
  return res.text();
}

function checkCode(res) {
  if (typeof res === "string") {
    throw new Error(res);
  }
  return res;
}

export async function downloadBackEnd(appAccessCode: string, fileName: string) {
  return fetch(`${$R_P.config.baseUrl}/manage/v1/applications/export/${appAccessCode}`, {
    headers: $R_P.config.commonHeaders,
  }).then(checkStatus).then(checkCode).then((res) => res.blob().then((blob) => {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${fileName}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  }));
}

export async function downloadFrontEnd(accessName: string, fileName: string, id: string | number) {
  return fetch(`${window.$AppConfig.FEResourceServerUrl}/node-web/release-app/${$R_P.urlManager.currLessee}/${accessName}?releaseId=${id}`, {
    method: "GET",
    headers: $R_P.config.commonHeaders,
  }).then(checkStatus).then(checkCode).then((res) => res.blob().then((blob) => {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${fileName}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  }));
}
