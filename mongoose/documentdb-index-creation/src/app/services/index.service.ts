import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  Collection,
  Connection,
  IndexDefinition,
  IndexOptions,
} from 'mongoose';
import { isDeepStrictEqual } from 'util';

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
        await model.createCollection();

        const existingIndexes = await model.collection.indexes();
        const definedIndexes = model.schema.indexes();

        for (const definedIndex of definedIndexes) {
          const alreadyExistingIndex = existingIndexes.find(
            (existingIndex) => {
              return existingIndex.name === definedIndex[1].name;
            },
          );

          if (alreadyExistingIndex) {
            this.isIndexSchemaInSync(
              modelName,
              alreadyExistingIndex,
              definedIndex,
            );
            continue;
          }

          const [indexSpecification, indexOptions] = definedIndex;
          const indexName = indexOptions.name;

          this.logger.log(
            `⏳ Creating ${JSON.stringify(indexOptions)} index for ${modelName} where the index name is ${indexName}`,
          );

          await model.collection.createIndex(
            indexSpecification as Parameters<
              (typeof Collection)['createIndex']
            >['0'],
            indexOptions as Parameters<
              (typeof Collection)['createIndex']
            >['1'],
          );

          this.logger.log(
            `✅ ${indexName} index has been created for ${modelName}`,
          );
        }

        this.findOrphanedIndexes(
          modelName,
          existingIndexes,
          definedIndexes,
        );

        this.logger.log(`✅ Indexes created for: ${modelName}`);
      } catch (err) {
        this.logger.error(`❌ Index error for ${modelName}:`, err);

        throw err;
      }
    }
  }

  private isIndexSchemaInSync(
    modelName: string,
    existingIndex: Awaited<ReturnType<Collection['indexes']>>[number],
    definedIndex: [IndexDefinition, IndexOptions],
  ) {
    const definedIndexOptions = definedIndex[1];
    const { v: _v, key: _key, ...rest } = existingIndex;

    if (!isDeepStrictEqual(definedIndexOptions, rest)) {
      this.logger.warn(
        `${modelName}'s defined index in code does not match the index options in the database (Defined index: ${JSON.stringify(definedIndexOptions)}, existing index: ${JSON.stringify(existingIndex)})`,
      );
      return false;
    }

    return true;
  }

  private findOrphanedIndexes(
    modelName: string,
    existingIndexes: Awaited<ReturnType<Collection['indexes']>>,
    definedIndexes: [IndexDefinition, IndexOptions][],
  ) {
    const definedIndexesNames = definedIndexes
      .map(([_, options]) => options.name)
      .filter(Boolean) as string[];
    const extraIndexes = existingIndexes
      .filter(
        (existingIndex) =>
          existingIndex.name &&
          !definedIndexesNames.includes(existingIndex.name),
      )
      .filter((extraIndex) => extraIndex.name !== '_id_');

    if (extraIndexes.length > 0) {
      const extraIndexesNames = extraIndexes
        .map((extraIndex) => extraIndex.name)
        .filter(Boolean);

      this.logger.log(
        `ℹ️ Extra indexes in DB for ${modelName}: ${extraIndexesNames.join(', ')}`,
      );

      return extraIndexes;
    }
  }
}
