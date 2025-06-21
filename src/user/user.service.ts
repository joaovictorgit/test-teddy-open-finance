import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Result } from '@/common/result';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async addUser(email: string, password: string): Promise<Result<User, Error>> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.findUserByEmail(email);

    if (user) {
      return new Result(null as any, new Error('Email já está cadastrado na plataforma!'));
    }

    const savedUser = await this.userRepository.save({
      email,
      password: hashedPassword,
    });

    return new Result(savedUser, null as any);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user ?? null;
  }
}
