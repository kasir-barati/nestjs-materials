import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

/**
 * @example
 *
 * ```ts
 * import { Seeder } from 'shared';
 * import { Alert } from '../alert/entities/alert.entity';
 *
 * export class AlertSeeder extends Seeder<Alert> {
 *   async seed(data: Alert[]): Promise<void> {
 *     await this.getRepository().save(alerts);
 *   }
 * }
 *
 * // usage, No need to implement seedInTransaction
 * new AlertSeeder(initializedDataSource, AlertType).seedInTransaction()
 * ```
 */
export abstract class Seeder<T extends ObjectLiteral> {
  constructor(
    private dataSource: DataSource,
    private entity: EntityTarget<T>,
  ) {}

  protected getRepository() {
    return this.dataSource.getRepository(this.entity);
  }

  abstract seed(): Promise<void>;

  /**
   * @readonly Do not override this method in subclasses.
   */
  async seedInTransaction(): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      this.dataSource = manager.connection;
      await this.seed();
    });
  }
}
