import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PageDataModule } from './page-data/page-data.module';
import { ResHelperModule } from './res-helper/res-helper.module';
import { PreviewAppModule } from './preview-app/preview-app.module';
import { ReleaseAppModule } from './release-app/release-app.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    PageDataModule, ReleaseAppModule, 
    ResHelperModule, PreviewAppModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply()
  }
}
