import { Test, TestingModule } from '@nestjs/testing';
import { CvService } from './cv.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CvService', () => {
  let service: CvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CvService, PrismaService],
    }).compile();

    service = module.get<CvService>(CvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
