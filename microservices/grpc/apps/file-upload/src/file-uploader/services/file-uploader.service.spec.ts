import { FileUploaderService } from './file-uploader.service';

describe('FileUploaderService', () => {
  let service: FileUploaderService;

  beforeEach(async () => {
    service = new FileUploaderService({} as any, {} as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
