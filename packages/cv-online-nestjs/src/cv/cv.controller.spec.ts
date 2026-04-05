import { Test, TestingModule } from '@nestjs/testing';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CvController', () => {
  let controller: CvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvController],
      providers: [CvService, PrismaService],
    }).compile();

    controller = module.get<CvController>(CvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
