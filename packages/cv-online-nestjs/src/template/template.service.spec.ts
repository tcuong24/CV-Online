import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateService, PrismaService],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


