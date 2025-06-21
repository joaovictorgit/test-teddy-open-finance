import { Module } from '@nestjs/common';
import { dataBaseProviders } from './databse.providers';

@Module({
  providers: [...dataBaseProviders],
  exports: [...dataBaseProviders],
})
export class DatabaseModule {}
