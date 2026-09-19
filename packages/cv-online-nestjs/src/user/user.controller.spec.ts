import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findPublicProfile: jest.fn(),
    updateProfileVisibility: jest.fn(),
    updateAvatarUrl: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('controller phải được khởi tạo thành công', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('phải gọi userService.findAll và trả về danh sách user', async () => {
      const mockUsers = [{ id: 'user-1', email: 'test@example.com' }];
      mockUserService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });
});
