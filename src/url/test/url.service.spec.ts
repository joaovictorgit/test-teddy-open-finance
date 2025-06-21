import { Repository } from "typeorm";
import { Url } from "../url.entity";
import { UrlService } from "../url.service";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "@/user/user.entity";

describe('UrlService', () => {
  let service: UrlService;
  let repository: jest.Mocked<Repository<Url>>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<Url>>;
  
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: 'URL_REPOSITORY',
          useValue: repository,
        },
      ],
    }).compile();
  
    service = module.get<UrlService>(UrlService);
  });

  it('should create a shortened URL', async () => {
    jest.spyOn(service as any, 'generateUniqueCode').mockResolvedValue('jvaf16')

    const url = {
      shortCode: 'jvaf16',
      originalUrl: 'http://example.com'
    } as Url;

    repository.create.mockReturnValue(url);
    repository.save.mockResolvedValue(url);

    const result = await service.createLink('http://example.com');

    expect(repository.create).toHaveBeenCalledWith({
      originalUrl: 'http://example.com',
      shortCode: 'jvaf16'
    });
    expect(repository.save).toHaveBeenCalledWith(url);
    expect(result.isError()).toBeFalsy();
    expect(result.value).toBe('http://localhost/jvaf16');
  });

  it('should return error if saving URL fails', async () => {
    jest.spyOn(service as any, 'generateUniqueCode').mockResolvedValue('jvaf16');

    repository.create.mockReturnValue({} as Url);
    repository.save.mockRejectedValue(new Error('Error'));

    const result = await service.createLink('http://fail.com');

    expect(result.isError()).toBe(true);
    expect(result.error.message).toBe('Erro ao salvar URL encurtada.');
  });

  it('should get original URL and increment click', async () => {
    const url = {
      shortCode: 'jvaf16',
      originalUrl: 'http://example.com',
      click: 0,
    } as Url;

    repository.findOne.mockResolvedValue(url);
    repository.save.mockResolvedValue({ ...url, click: 1 });

    const result = await service.getOriginalUrlAndUpdateClick('jvaf16');

    expect(repository.findOne).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ click: 1 }));
    expect(result.isError()).toBeFalsy();
    expect(result.value.click).toBe(1);
  });

  it('should return error if URL not found', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await service.getOriginalUrlAndUpdateClick('notfound');

    expect(result.isError()).toBe(true);
    expect(result.error.message).toBe('Url não encontrada!');
  });

  it('should update the original URL if shortCode exists', async () => {
    const url = {
      shortCode: 'jvaf16',
      originalUrl: 'http://old.com',
    } as Url;

    const updateUrl = {
      ...url,
      originalUrl: 'http://new.com'
    } as Url;

    repository.findOne.mockResolvedValue(url);
    repository.save.mockResolvedValue(updateUrl);

    const result = await service.updateOriginalUrl('http://new.com', 'jvaf16');

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { shortCode: 'jvaf16', deletedAt: expect.anything() },
    });
    expect(repository.save).toHaveBeenCalledWith(updateUrl);
    expect(result.isError()).toBeFalsy();
    expect(result.value.originalUrl).toBe('http://new.com');
  });

  it('should return error if shortCode does not exist on update', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await service.updateOriginalUrl('http://any.com', 'invalidCode');

    expect(result.isError()).toBe(true);
    expect(result.error.message).toBe('Url não encontrada!');
  });

  it('should mark the URL as deleted (soft delete)', async () => {
    const fakeUrl = {
      shortCode: 'deleteMe',
      deletedAt: null,
    } as Url;

    const deletedUrl = {
      ...fakeUrl,
      deletedAt: new Date(),
    } as Url;

    repository.findOne.mockResolvedValue(fakeUrl);
    repository.save.mockResolvedValue(deletedUrl);

    const result = await service.deleteShortCode('deleteMe');

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { shortCode: 'deleteMe', deletedAt: expect.anything() },
    });
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
      deletedAt: expect.any(Date),
    }));
    expect(result.isError()).toBeFalsy();
    expect(result.value.deletedAt).toBeInstanceOf(Date);
  });
  
  it('should return error if trying to delete a non-existing URL', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await service.deleteShortCode('notExists');

    expect(result.isError()).toBe(true);
    expect(result.error.message).toBe('Url não encontrada!');
  });

  it('should return all user URLs not deleted', async () => {
    const user = { id: '42' } as User;

    const urls = [
      { id: '1', shortCode: 'abc', originalUrl: 'http://site1.com' },
      { id: '2', shortCode: 'def', originalUrl: 'http://site2.com' },
    ] as Url[];

    repository.find.mockResolvedValue(urls);

    const result = await service.getAllUrlsByUser(user);

    expect(repository.find).toHaveBeenCalledWith({
      where: {
        user: { id: '42' },
        deletedAt: expect.anything(),
      },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
    expect(result.isError()).toBeFalsy();
    expect(result.value).toHaveLength(2);
  });
});