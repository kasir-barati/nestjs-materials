import { AlertType } from '../alert-type/entities/alert-type.entity';
import { Alert } from '../alert/entities/alert.entity';
import dataSource from '../data-source';
import { AlertTypeSeeder } from './alert-type.seed';
import { AlertSeeder } from './alert.seed';

(async () => {
  const initializedDataSource = await dataSource.initialize();
  const seeders = [
    new AlertTypeSeeder(initializedDataSource, AlertType),
    new AlertSeeder(initializedDataSource, Alert),
  ];

  for (const seeder of seeders) {
    await seeder.seedInTransaction();
  }
})()
  .then(console.log.bind(this, 'Seed completed!'))
  .catch(console.error);
