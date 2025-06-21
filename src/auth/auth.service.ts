import { Injectable } from '@nestjs/common';
import { Result } from 'src/common/result';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async onSignIn(email: string, password: string): Promise<Result<{ access_token: string }, Error>> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return new Result(null as any, new Error('Usuário não cadastrado!'));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new Result(null as any, new Error('Senha incorreta!'));
    }

    const payload = {
      sub: user.id,
      username: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return new Result({ access_token }, null as any);
  }
}
