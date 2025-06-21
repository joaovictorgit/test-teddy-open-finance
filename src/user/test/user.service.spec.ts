import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UserService } from '../user.service';
import { User } from '../user.entity';

describe('UserService', () => {
  let service: UserService
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_REPOSITORY',
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should register a new user if the email is not in use', async () => {
    repository.findOne!.mockResolvedValue(null);

    repository.save.mockImplementation(async (user: Partial<User>) => ({
      id: '1',
      email: user.email,
      password: user.password,
    }) as User);

    const result = await service.addUser('test@example.com', '1234');

    expect(result.isError()).toBeFalsy();
    expect(result.value.email).toBe('test@example.com');
    expect(repository.save).toHaveBeenCalled;
  });
});