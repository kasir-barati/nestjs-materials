import { DefaultApi } from '../../../api-client';

export class CategoryFinder {
  private readonly defaultApi: DefaultApi;

  constructor() {
    this.defaultApi = new DefaultApi();
  }

  findOne(id: string) {
    return this.defaultApi.categoryControllerFindOne({
      id,
    });
  }
}
