import { Body, Controller, HttpStatus, Logger, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { UserResource } from '@/user/user.resource';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ description: 'Autenticando' })
  async singIn(@Body() user: UserResource, @Res() res: Response) {
    this.logger.log('Autenticando usuário');

    const result = await this.authService.onSignIn(user.email, user.password);

    if (result.isError()) {
      this.logger.error(result.error.message);

      return res.status(HttpStatus.BAD_REQUEST).json(result.error.message);
    }

    this.logger.log('Usuário autenticado!');

    return res.status(HttpStatus.OK).json(result.value);
  }
}
