/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require("path");
const { readJson } = require("fs-extra");

interface IEnv {
  paasServerUrl: string;
}

export function getEnvConfig(): Promise<IEnv> {
  return new Promise((resolve, reject) => {
    readJson(join(process.cwd(), `env.json`), (err: Error, json: IEnv) => {
      if (err) {
        reject(err);
      } else {
        resolve(json);
      }
    });
  });
}
