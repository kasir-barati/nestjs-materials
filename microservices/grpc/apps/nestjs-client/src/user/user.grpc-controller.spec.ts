import { Test, TestingModule } from '@nestjs/testing';

import { UserGrpcController } from './user.grpc-controller';

describe('UserGrpcController', () => {
  let controller: UserGrpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGrpcController],
    }).compile();

    controller = module.get<UserGrpcController>(UserGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
