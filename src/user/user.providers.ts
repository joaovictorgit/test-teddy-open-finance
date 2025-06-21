import { Provider } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";

const userRepository: Provider<Repository<User>> = {
  provide: 'USER_REPOSITORY',
  useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  inject: ['DATA_SOURCE'],
}

export const userProviders: Provider[] = [userRepository];