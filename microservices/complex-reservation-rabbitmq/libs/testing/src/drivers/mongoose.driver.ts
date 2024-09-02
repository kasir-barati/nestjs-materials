import { connect } from 'mongoose';

export class MongooseDriver {
  private mongoose: typeof import('mongoose');

  async connect({
    databaseName,
    databaseUrl,
  }: {
    databaseUrl: string;
    databaseName: string;
  }) {
    this.mongoose = await connect(databaseUrl, {
      dbName: databaseName,
    });

    return this.mongoose;
  }

  async cleanup(collectionNames: string[]) {
    for (const collectionName of collectionNames) {
      await this.mongoose.connection
        .collection(collectionName)
        .deleteMany({});
    }
  }
}
