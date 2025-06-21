import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Request, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UrlService } from './url.service';
import { Response } from 'express';
import { AuthGuard } from '@/auth/auth.guard';
import { OptionalAuthGuard } from '@/auth/authOptional.guard';
import { UserService } from '@/user/user.service';
import { User } from '@/user/user.entity';
import { ShortCodeResource, UrlResource } from './url.resource';

@Controller('url')
@ApiTags('url')
export class UrlController {
  private readonly logger = new Logger(UrlController.name);

  constructor(
    private readonly urlService: UrlService,
    private readonly userService: UserService
  ) {}

  @UseGuards(OptionalAuthGuard)
  @Post()
  async generate(
    @Body() url: UrlResource,
    @Request() req,
    @Res() res: Response
  ) {
    this.logger.log('Encurtando url');

    let user: User | undefined;

    if (req.user) {
      user = await this.userService.findUserByEmail(req.user.username) || undefined;
    }

    const result = await this.urlService.createLink(url.originalUrl, user);

    if (result.isError()) {
      this.logger.log(result.error.message);

      return res.status(HttpStatus.CONFLICT).json(result.error.message);
    }

    this.logger.log('Nova url gerada');

    return res.status(HttpStatus.OK).json(result.value);
  }

  @UseGuards(AuthGuard)
  @Get('list')
  async listUserUrls(
    @Request() req,
    @Res() res: Response
  ) {
    this.logger.log('Listando URLs do usuário');

    const user = await this.userService.findUserByEmail(req.user.username);

    if (!user) {
      return res.status(HttpStatus.CONFLICT).json('Usuário não encontrado!');
    }

    const result = await this.urlService.getAllUrlsByUser(user);

    if (result.isError()) {
      this.logger.error(result.error.message);

      return res.status(HttpStatus.BAD_REQUEST).json(result.error.message);
    }

    return res.status(HttpStatus.OK).json(result.value);
  }

  @UseGuards(AuthGuard)
  @Put(':shortCode')
  async update(
    @Param() code: ShortCodeResource,
    @Body() url: UrlResource,
    @Res() res: Response
  ) {
    this.logger.log('Atualizando url de origem');

    const result = await this.urlService.updateOriginalUrl(url.originalUrl, code.shortCode);

    if (result.isError()) {
      this.logger.error(result.error.message);

      return res.status(HttpStatus.BAD_REQUEST).json(result.error.message);
    }

    this.logger.log('Url atualizada!');

    return res.status(HttpStatus.OK).json(result.value);
  }

  @UseGuards(AuthGuard)
  @Delete(':shortCode')
  async delete(
    @Param() code: ShortCodeResource,
    @Res() res: Response
  ) {
    this.logger.log('Deletando url');

    const result = await this.urlService.deleteShortCode(code.shortCode);

    if (result.isError()) {
      this.logger.error(result.error.message);

      return res.status(HttpStatus.BAD_REQUEST).json(result.error.message);
    }

    this.logger.log('Url deletada');

    return res.status(HttpStatus.OK).json(result.value);
  }

  @Get(':shortCode')
  async redirect(
    @Param() code: ShortCodeResource,
    @Res() res: Response
  ) {
    const result = await this.urlService.getOriginalUrlAndUpdateClick(code.shortCode);

    if (result.isError()) {
      this.logger.log(result.error.message);

      return res.status(HttpStatus.CONFLICT).json(result.error.message);
    }

    this.logger.log('Redirecionando para o site original');

    return res.redirect(result.value.originalUrl);
  }
}
