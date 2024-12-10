import { Test, TestingModule } from '@nestjs/testing';
import { TalentService } from './talent.service';

describe('TalentService', () => {
  let service: TalentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TalentService],
    }).compile();

    service = module.get<TalentService>(TalentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
