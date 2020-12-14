import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import config from "../config";
import { registerConsul } from "./consul/register";

const port = process.env.PORT || config.post;

async function bootstrap() {
  // 根据环境变量注册对应的 consul
  await registerConsul();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.globalPrefix);
  app.enableCors();
  await app.listen(port).then(async () => {
    console.log("platform-web-server 服务启动成功");
  });
}

bootstrap();
