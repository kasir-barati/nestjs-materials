import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

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
        /**@description This action is idempotent, so we can call it as many times as we wanted and it will not recreate existing indexes */
        // https://github.com/Automattic/mongoose/discussions/15463#discussion-8414826
        await model.createIndexes();

        this.logger.log(`✅ Indexes created for: ${modelName}`);
      } catch (err) {
        this.logger.error(`❌ Index error for ${modelName}:`, err);

        throw err;
      }
    }
  }

  private async createIndexIfTheyDoNotExists(
    modelName: string,
    model: Model<unknown, unknown, unknown, object, unknown, unknown>,
  ) {
    const existingIndexes = await model.collection.indexes();
    const existingIndexesNames = existingIndexes
      .map((index) => index.name)
      .filter(Boolean) as string[];
    const definedIndexes = model.schema.indexes();
    const missingIndexes = definedIndexes.filter(
      ([_, options]) =>
        options?.name && !existingIndexesNames.includes(options.name),
    );

    if (missingIndexes.length > 0) {
      this.logger.log(
        `⏳ Creating ${missingIndexes.length} indexes for ${modelName}: ${missingIndexes.map(([_, options]) => options.name).join(', ')}`,
      );

      for (const [spec, options] of missingIndexes) {
        // @ts-expect-error This is OK
        await model.collection.createIndex(spec, options);
      }

      this.logger.log(`✅ Created indexes for ${modelName}`);
    } else {
      this.logger.log(`✅ All indexes exist for ${modelName}`);
    }

    const definedIndexesNames = definedIndexes
      .map(([_, options]) => options.name)
      .filter(Boolean) as string[];
    const extraIndexes = existingIndexesNames.filter(
      (name) => !definedIndexesNames.includes(name),
    );

    if (extraIndexes.length > 0) {
      this.logger.log(
        `ℹ️ Extra indexes in DB for ${modelName}: ${extraIndexes.join(', ')}`,
      );
    }
  }
}
