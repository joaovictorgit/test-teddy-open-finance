import { Inject, Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { Url } from './url.entity';
import { User } from 'src/user/user.entity';
import { Result } from '@/common/result';
import { randomBytes } from 'crypto';

@Injectable()
export class UrlService {
  constructor(
    @Inject('URL_REPOSITORY')
    private readonly urlRepository: Repository<Url>,
  ) {}

  async createLink(originalUrl: string, user?: User): Promise<Result<String, Error>> {
    const shortCode = await this.generateUniqueCode();

    try {
      const url = this.urlRepository.create({
        originalUrl,
        shortCode,
      });

      if (user) {
        url.user = user;
      }

      const saved = await this.urlRepository.save(url);
      return new Result(`http://localhost/${saved.shortCode}`, null as any);
    } catch (err) {
      return new Result(null as any, new Error('Erro ao salvar URL encurtada.'));
    }
  }

  async getOriginalUrlAndUpdateClick(shortCode: string): Promise<Result<Url, Error>> {
    const url = await this.findUrl(shortCode);

    if (!url) {
      return new Result(null as any, new Error('Url não encontrada!'));
    }

    url.click += 1;

    await this.urlRepository.save(url);

    return new Result(url, null as any);
  }

  async updateOriginalUrl(originalUrl: string, shortCode: string): Promise<Result<Url, Error>> {
    const url = await this.findUrl(shortCode);

    if (!url) {
      return new Result(null as any, new Error('Url não encontrada!'));
    }

    url.originalUrl = originalUrl;

    const updated = await this.urlRepository.save(url);

    return new Result(updated, null as any);
  }

  async deleteShortCode(shortCode: string): Promise<Result<Url, Error>> {
    const url = await this.findUrl(shortCode);

    if (!url) {
      return new Result(null as any, new Error('Url não encontrada!'));
    }

    url.deletedAt = new Date();

    const updated = await this.urlRepository.save(url);

    return new Result(updated, null as any);
  }

  async getAllUrlsByUser(user: User): Promise<Result<Url[], Error>> {
    const urls = await this.urlRepository.find({
      where: {
        user: { id: user.id },
        deletedAt: IsNull(),
      },
      relations: ['user'],
      order: {
        createdAt: 'ASC'
      }
    });

    return new Result(urls, null as any);
  }

  private async generateUniqueCode(length = 6): Promise<string> {
    let code: string;
    let exists: Url | null;

    do {
      code = randomBytes(length).toString('base64url').slice(0, length);
      exists = await this.urlRepository.findOne({ where: { shortCode: code } });
    } while (exists);

    return code;
  }

  private async findUrl(shortCode: string): Promise<Url | null> {
    const url = await this.urlRepository.findOne({
      where: {
        shortCode,
        deletedAt: IsNull()
      }
    });

    return url;
  }
}
