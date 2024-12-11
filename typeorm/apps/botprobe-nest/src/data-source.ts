// Use it just for migration
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';

if (!process.env.DATABASE_URL) {
  throw 'UndefinedEnvironmentVariableDatabaseUrl';
}

const options = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['**/*.entity{.ts,.js}'],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
} satisfies TypeOrmModuleOptions;

export default new DataSource(options);
