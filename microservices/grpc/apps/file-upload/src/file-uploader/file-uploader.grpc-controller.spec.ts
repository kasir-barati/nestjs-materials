import { FileUploaderGrpcController } from './file-uploader.grpc-controller';

describe('FileUploaderGrpcController', () => {
  let controller: FileUploaderGrpcController;

  beforeEach(async () => {
    controller = new FileUploaderGrpcController({} as any);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
