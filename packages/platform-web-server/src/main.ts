import { NestFactory } from "@nestjs/core";
import { ensureDir, writeJSON } from "fs-extra";
import axios from "axios";
import { AppModule } from "./app.module";
import config from "../config";
import ConsulConfig from "./consul";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const port = process.env.PORT || config.post;
const consul = new ConsulConfig();

// export function logger(req, res, next) {
//   console.log(`Request...`);
//   next();
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: new PlatformLogger()
  });
  app.setGlobalPrefix(config.globalPrefix);
  // app.use(logger);
  app.enableCors();
  await app.listen(port).then(async () => {
    // 根据环境变量注册对应的 consul
    if (process.env.CONSUL_HOST && process.env.CONSUL_PORT && process.env.CONSUMER_HOST) {
      const namespace = process.env.CONSUL_NAMESPACE;
      console.log(
        "注册 consul",
        process.env.CONSUL_HOST,
        process.env.CONSUL_PORT,
        process.env.CONSUMER_HOST
      );
      consul.register();
      // 从 consul 更新 config
      try {
        const cfg = await axios
          .get(
            `http://${process.env.CONSUL_HOST}:${
              process.env.CONSUL_PORT
            }/v1/kv/config/consumer-app-server${
              namespace ? `/${namespace}` : ""
            }/custom-platform-provider-web-server.json?t=${Date.now()}`
          )
          .then((res) => res.data);

        if (cfg[0] && cfg[0].Value) {
          const configStr = Buffer.from(cfg[0].Value, "base64").toString();
          await ensureDir(path.join(__dirname));
          await writeJSON(path.join(__dirname, "env.json"), JSON.parse(configStr));
          console.log("更新 config 成功");
        } else {
          console.log("consul 返回配置异常", cfg);
        }
      } catch (error) {
        console.log("consul 更新配置失败", error);
      }
    }
  });
}

bootstrap();
