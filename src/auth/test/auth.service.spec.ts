import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { UserService } from "@/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findUserByEmail: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return error if user not found', async () => {
    userService.findUserByEmail!.mockResolvedValue(null);

    const result = await service.onSignIn('test@example.com', '123');

    expect(result.isError()).toBe(true);
    expect(result.error.message).toBe('Usuário não cadastrado!');
  });

  it('should return error if password does not match', async () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      password: await bcrypt.hash('1234', 10),
    }

    userService.findUserByEmail!.mockResolvedValue(user);

    const result = await service.onSignIn('test@example.com', '5678');

    expect(result.isError()).toBe(true);
    expect(result.error.message).toBe('Senha incorreta!')
  });

  it('should return access_token if credentials are valid', async () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      password: await bcrypt.hash('1234', 10),
    }

    userService.findUserByEmail!.mockResolvedValue(user);
    jwtService.signAsync!.mockResolvedValue('token');

    const result = await service.onSignIn('test@example.com', '1234');

    expect(result.isError()).toBeFalsy();
    expect(result.value.access_token).toBe('token');
  });
});