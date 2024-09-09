import { Types } from 'mongoose';
import { CreatedOrUpdatedProductDto, ProductApi } from '../../../api-client';
import { ProductBuilder } from '../../../builders/product.builder';

describe('Product API (e2e -- business)', () => {
  let productApi: ProductApi;

  beforeEach(() => {
    productApi = new ProductApi();
  });

  it('should create product', async () => {
    const id = new Types.ObjectId().toString();

    const { data: product } = await productApi.productControllerCreateOrUpdate({
      id,
      createOrUpdateProductDto: {
        name: 'product one',
        quantity: 12,
      },
    });

    expect(product).toStrictEqual({
      _id: id,
      name: 'product one',
      quantity: 12,
    } as CreatedOrUpdatedProductDto);
  });

  it('should update product', async () => {
    const id = await new ProductBuilder().build();

    const { data: product } = await productApi.productControllerCreateOrUpdate({
      id,
      createOrUpdateProductDto: {
        quantity: 10,
      },
    });

    expect(product).toStrictEqual(
      expect.objectContaining({
        _id: id,
        quantity: 10,
      } as CreatedOrUpdatedProductDto),
    );
  });
});
