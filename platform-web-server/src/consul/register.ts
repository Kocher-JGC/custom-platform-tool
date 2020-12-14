import axios from "axios";
import { writeJSON } from "fs-extra";
// import path from 'path';
import { ConsulConfig } from "./config";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const consul = new ConsulConfig();

export const registerConsul = async () => {
  if (process.env.CONSUL_HOST && process.env.CONSUL_PORT && process.env.CONSUMER_HOST && process.env.CONSUMER_PORT) {
    const namespace = process.env.CONSUL_NAMESPACE;
    console.log(
      "注册 consul",
      process.env.CONSUL_HOST,
      process.env.CONSUL_PORT,
      process.env.CONSUMER_HOST,
      process.env.CONSUMER_PORT
    );

    // 从 consul 更新 config
    try {
      await consul.register();
      const cfg = await axios
        .get(
          `http://${process.env.CONSUL_HOST}:${
            process.env.CONSUL_PORT
          }/v1/kv/config/custom-platform-v3-frontend${
            namespace ? `/${namespace}` : ""
          }/node_web_server.json?t=${Date.now()}`
        )
        .then((res) => res.data);
      if (cfg[0] && cfg[0].Value) {
        const configStr = Buffer.from(cfg[0].Value, "base64").toString();
        console.log("更新 config", configStr);
        await writeJSON(path.join(process.cwd(), "env.json"), JSON.parse(configStr));
        console.log("更新 config 成功");
      } else {
        console.log("consul 返回配置异常", cfg);
      }
    } catch (error) {
      console.log("consul 更新配置失败", error);
    }
  } else {
    console.log("不存在 consul 相关完整参数，使用默认 env.json 配置");
  }
};
