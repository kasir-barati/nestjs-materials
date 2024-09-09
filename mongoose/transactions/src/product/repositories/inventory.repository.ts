import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../../database/abstract.repository';
import { Inventory } from '../entities/inventory.entity';

@Injectable()
export class InventoryRepository extends AbstractRepository<Inventory> {
  protected readonly logger = new Logger(InventoryRepository.name);

  constructor(
    @InjectModel(Inventory.name)
    protected readonly model: Model<Inventory>,
  ) {
    super(model);
  }
}
