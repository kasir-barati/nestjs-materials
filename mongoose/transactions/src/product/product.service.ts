import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrUpdateProductDto } from './dto/create-product.dto';
import { InventoryRepository } from './repositories/inventory.repository';
import { ProductRepository } from './repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  async createOrUpdate(
    id: string,
    createOrUpdateProductDto: CreateOrUpdateProductDto,
  ) {
    console.log('\n\r\n\r');
    console.log('----------------------Service 1----------------------');
    console.log('\n\r\n\r');
    const product = await this.productRepository.findOne({ _id: id });
    console.log('\n\r\n\r');
    console.log('----------------------Service 2----------------------');
    console.log('\n\r\n\r');

    if (product) {
      console.log('\n\r\n\r');
      console.log('----------------------Service 2.1----------------------');
      console.log('\n\r\n\r');
      const updatedProduct = await this.update(id, createOrUpdateProductDto);
      console.log('\n\r\n\r');
      console.log('----------------------Service 2.2----------------------');
      console.log('\n\r\n\r');

      return { status: 'updated', data: updatedProduct };
    }

    this.beforeCreateValidations(createOrUpdateProductDto);
    console.log('\n\r\n\r');
    console.log('----------------------Service 3----------------------');
    console.log('\n\r\n\r');

    const createdProduct = await this.productRepository.create({
      _id: id,
      name: createOrUpdateProductDto.name,
      quantity: createOrUpdateProductDto.quantity,
    });
    console.log('\n\r\n\r');
    console.log('----------------------Service 4----------------------');
    console.log('\n\r\n\r');

    await this.inventoryRepository.create({
      productId: id,
      quantity: createOrUpdateProductDto.quantity,
    });

    console.log('\n\r\n\r');
    console.log('----------------------Service 5----------------------');
    console.log('\n\r\n\r');

    return { status: 'created', data: createdProduct };
  }

  private async update(
    id: string,
    createOrUpdateProductDto: CreateOrUpdateProductDto,
  ) {
    if (createOrUpdateProductDto.name === null) {
      throw new BadRequestException('NullName');
    }
    if (createOrUpdateProductDto.quantity === null) {
      throw new BadRequestException('NullQuantity');
    }

    const product = await this.productRepository.update(
      id,
      createOrUpdateProductDto,
    );

    if (createOrUpdateProductDto.quantity) {
      await this.inventoryRepository.updateMany(
        { _id: id },
        { quantity: createOrUpdateProductDto.quantity },
      );
    }

    return product;
  }

  private beforeCreateValidations(
    createOrUpdateProductDto: CreateOrUpdateProductDto,
  ) {
    if (!createOrUpdateProductDto.name) {
      throw new BadRequestException('UndefinedProductName');
    }
    if (!createOrUpdateProductDto.quantity) {
      throw new BadRequestException('UndefinedProductQuantity');
    }
  }
}
