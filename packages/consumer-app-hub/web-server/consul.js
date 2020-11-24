const Consul = require('consul');
const p = require('./package.json');
const config = require('./config.json');

class ConsulConfig {
  register() {
    const host = process.env.CONSUL_HOST;
    const port = process.env.CONSUL_PORT;
    const address = process.env.CONSUMER_HOST;

    if (!host || !port || !address) {
      console.error("consul 注册失败", "缺少参数");
      return;
    }

    this.consul = new Consul({ host, port, promisify: true });
    this.consul.agent.service.register({
      name:`${p.name.toUpperCase()}-${p.version}`,
      address,
      port: config.port,
      check: {
        http: `http://${address}:${config.port}/health`,
        interval: '10s',
        timeout: '5s',
      }
    }, (err) => {
      if (err) {
        console.error("consul 注册失败", err);
        throw err;
      } else {
        console.log(`consul 注册成功`);
      }
    });
  }
}

module.exports = ConsulConfig;
