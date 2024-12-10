import { Test, TestingModule } from '@nestjs/testing';
import { AlertResolver } from './alert.resolver';
import { AlertService } from './alert.service';

describe('AlertResolver', () => {
  let resolver: AlertResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertResolver, AlertService],
    }).compile();

    resolver = module.get<AlertResolver>(AlertResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
