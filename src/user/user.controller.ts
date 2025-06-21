import { Body, Controller, HttpStatus, Logger, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResource } from './user.resource';
import { Response } from 'express';

@Controller('user')
@ApiTags('User')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ description: 'Criando um usuário' })
  async createUser(@Body() user: UserResource, @Res() res: Response) {
    this.logger.log('Criando um novo usuário');

    const result = await this.userService.addUser(user.email, user.password);

    if (result.isError()) {
      this.logger.error(
        'Erro ao tentar criar usuário: ' + result.error.message,
      );

      return res.status(HttpStatus.CONFLICT).json(result.error.message);
    }

    this.logger.log('Usuário cadastrado com sucesso!');

    return res.status(HttpStatus.CREATED).json(result.value);
  }
}
