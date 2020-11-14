import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from '../config';

const port = process.env.PORT || config.post;

export function logger(req, res, next) {
  console.log(`Request...`);
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('node-web');
  app.use(logger);
  app.enableCors();
  await app.listen(port);
}

bootstrap();
