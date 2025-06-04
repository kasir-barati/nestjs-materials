import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';

export async function createIndex({
  model,
  logger,
  modelName,
}: {
  logger: Logger;
  modelName: string;
  model: Model<unknown, unknown, unknown, object, unknown, unknown>;
}) {
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
    logger.log(
      `⏳ Creating ${missingIndexes.length} indexes for ${modelName}: ${missingIndexes.map(([_, options]) => options.name).join(', ')}`,
    );

    for (const [spec, options] of missingIndexes) {
      // @ts-expect-error This is OK
      await model.collection.createIndex(spec, options);
    }

    logger.log(`✅ Created indexes for ${modelName}`);
  } else {
    logger.log(`✅ All indexes exist for ${modelName}`);
  }

  const definedIndexesNames = definedIndexes
    .map(([_, options]) => options.name)
    .filter(Boolean) as string[];
  const extraIndexes = existingIndexesNames.filter(
    (name) => !definedIndexesNames.includes(name),
  );

  if (extraIndexes.length > 0) {
    logger.log(
      `ℹ️ Extra indexes in DB for ${modelName}: ${extraIndexes.join(', ')}`,
    );
  }
}
