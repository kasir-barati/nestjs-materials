import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AbstractRepository } from '../../database/abstract.repository';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
  protected readonly logger = new Logger(ProductRepository.name);

  constructor(
    @InjectModel(Product.name)
    protected readonly model: Model<Product>,
  ) {
    super(model);
  }

  async findOne(filterQuery: FilterQuery<Product>) {
    const product = await this.model.findOne(filterQuery);

    if (!product) {
      return;
    }

    return product.toObject();
  }
}
