import { DefaultApi } from '../../../api-client';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';

describe('Category e2e (/ POST): validation', () => {
  let defaultApi: DefaultApi = new DefaultApi();

  beforeEach(async () => {});

  it.each<CreateCategoryDto>([
    { title: 19 as unknown as string },
    { title: 19.19 as unknown as string },
    { title: true as unknown as string },
    { title: null as unknown as string },
  ])(
    'should throw an error if title is not valid',
    async (category) => {
      const response = await defaultApi.categoryControllerCreate(
        {
          createCategoryDto: category,
        },
        {
          validateStatus(status) {
            return status === 400;
          },
        },
      );

      expect(response.data).toStrictEqual({
        error: 'Bad Request',
        message: ['title must be a string'],
        statusCode: 400,
      });
    },
  );
});
