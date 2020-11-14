import { Module } from '@nestjs/common';
import { ReleaseAppController } from './release-app.controller';
import { ReleaseAppService } from './release-app.service';
import { PageDataService } from '../page-data/page-data.service';

@Module({
  controllers: [ReleaseAppController],
  providers: [ReleaseAppService, PageDataService],
})
export class ReleaseAppModule {}
