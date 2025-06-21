import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { urlProviders } from './url.providers';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [UrlService, ...urlProviders],
  controllers: [UrlController],
  exports: [UrlService]
})
export class UrlModule {}
