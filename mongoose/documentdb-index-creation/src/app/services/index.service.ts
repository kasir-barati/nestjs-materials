import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export class IndexService implements OnApplicationBootstrap {
  private readonly logger = new Logger(IndexService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async onApplicationBootstrap() {
    await this.createIndexes();
  }

  private async createIndexes() {
    const models = this.connection.modelNames();
    this.logger.log(
      'Creating indexes for models: ' + models.join(', '),
    );

    for (const modelName of models) {
      const model = this.connection.model(modelName);
      try {
        await model.createIndexes();
        this.logger.log(`✅ Indexes created for: ${modelName}`);
      } catch (err) {
        this.logger.error(`❌ Index error for ${modelName}:`, err);
        throw err;
      }
    }
  }
}
