import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import config from "../config";
import { registerConsul } from "./consul/register";

const port = process.env.PORT || config.post;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.globalPrefix);
  app.enableCors();
  await app.listen(port).then(async () => {
    // 根据环境变量注册对应的 consul
    registerConsul();
  });
}

bootstrap();
