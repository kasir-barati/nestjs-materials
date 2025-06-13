import { Test, TestingModule } from '@nestjs/testing';

import { AppGrpcController } from './app.grpc-controller';
import { AppService } from './services/app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppGrpcController],
      providers: [{ provide: AppService, useValue: {} }],
    }).compile();
  });

  it('should be defined', () => {
    // const appController =
    //   app.get<AppGrpcController>(AppGrpcController);
    expect(app).toBeDefined();
  });
});
