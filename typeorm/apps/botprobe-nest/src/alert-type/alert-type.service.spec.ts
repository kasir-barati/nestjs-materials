import { Test, TestingModule } from '@nestjs/testing';
import { AlertTypeService } from './alert-type.service';

describe('AlertTypeService', () => {
  let service: AlertTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertTypeService],
    }).compile();

    service = module.get<AlertTypeService>(AlertTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
