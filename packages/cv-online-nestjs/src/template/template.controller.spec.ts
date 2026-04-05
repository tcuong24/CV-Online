import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TemplateController', () => {
  let controller: TemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [TemplateService, PrismaService],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});


