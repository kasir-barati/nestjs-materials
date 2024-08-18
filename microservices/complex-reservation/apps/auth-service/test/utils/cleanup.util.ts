import { connect } from 'mongoose';

let mongoose: typeof import('mongoose');

export async function cleanup() {
  const mongoose = await getMongoose();

  await mongoose.connection.collection('users').deleteMany({});
}

async function getMongoose() {
  if (!mongoose) {
    mongoose = await connect(process.env.DATABASE_URL, {
      dbName: process.env.MONGO_INITDB_DATABASE,
    });

    return mongoose;
  }

  return Promise.resolve(mongoose);
}
