import config from "../../config";
import * as p from "../../package.json";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Consul = require("consul");

export class ConsulConfig {
  consul: any;

  register() {
    const host = process.env.CONSUL_HOST;
    const port = process.env.CONSUL_PORT;
    const address = process.env.CONSUMER_HOST;
    const addressPort = process.env.CONSUMER_PORT;

    if (!host || !port || !address || !addressPort) {
      console.error("consul 注册失败", "缺少参数");
      return;
    }

    this.consul = new Consul({ host, port, promisify: true });
    this.consul.agent.service.register(
      {
        name: `${p.name.toUpperCase()}-${p.version}`,
        address,
        port: config.post,
        check: {
          http: `http://${address}:${addressPort}/${config.globalPrefix}/health`,
          interval: "10s",
          timeout: "5s"
        }
      },
      (err) => {
        if (err) {
          console.error("consul 注册失败", err);
          throw err;
        } else {
          console.log(`consul 注册成功`);
        }
      }
    );
  }
}
