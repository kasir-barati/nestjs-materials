import { isUUID } from 'class-validator';
import { DefaultApi } from '../../../api-client';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';

describe('Category e2e (/ POST): business logic', () => {
  let defaultApi: DefaultApi = new DefaultApi();

  beforeEach(async () => {});

  it.each<CreateCategoryDto>([
    { title: 'outlier' },
    { title: 'tinkerer' },
  ])('should be able to cerate category', async (category) => {
    const response = await defaultApi.categoryControllerCreate({
      createCategoryDto: category,
    });

    expect(response.data.id).toBeDefined();
    expect(isUUID(response.data.id)).toBeTruthy();
  });
});
