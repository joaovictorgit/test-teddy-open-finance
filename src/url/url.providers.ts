import { Provider } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Url } from "./url.entity";

const urlRepository: Provider<Repository<Url>> = {
  provide: 'URL_REPOSITORY',
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Url),
  inject: ['DATA_SOURCE'],
}

export const urlProviders: Provider[] = [urlRepository];