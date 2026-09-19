import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;

  // 1. Giả lập PrismaService với model 'user'
  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('service phải được khởi tạo thành công', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('phải gọi prisma.user.findMany và trả về danh sách user', async () => {
      // Arrange
      const mockUsers = [
        {
          id: 'user-1',
          email: 'test@example.com',
          fullName: 'Nguyen Van A',
          avatarUrl: null,
          subscriptionType: 'FREE',
          createdAt: new Date(),
        },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('create()', () => {
    it('phải tạo user mới thành công', async () => {
      // Arrange
      const newUserInput = {
        email: 'new@example.com',
        passwordHash: 'hashedpassword',
        fullName: 'New User',
      };
      const createdUser = { id: 'user-2', ...newUserInput };
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      // Act
      const result = await service.create(newUserInput);

      // Assert
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: newUserInput,
      });
      expect(result).toEqual(createdUser);
    });
  });
});
