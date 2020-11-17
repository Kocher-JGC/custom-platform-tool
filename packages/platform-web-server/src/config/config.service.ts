import { Injectable } from '@nestjs/common';
import config from '../../config';

@Injectable()
export class ConfigService {
  getEnvConfig() {
    return config;
  }
}
