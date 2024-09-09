import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { Inventory, InventorySchema } from './entities/inventory.entity';
import { Product, ProductSchema } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { InventoryRepository } from './repositories/inventory.repository';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Inventory.name,
        schema: InventorySchema,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, InventoryRepository],
})
export class ProductModule {}
